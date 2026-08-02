document.addEventListener('DOMContentLoaded', function () {
    initializeHeroLandingSlideshow();
    initializeMainSlideshow();
    initializeAdvertSlideshow();
    initializeGallerySlideshows();
    initializeChatbot();
});

// Global Helper Function for Touch Swipe Navigation
function addSwipeListener(element, onSwipeLeft, onSwipeRight) {
    let touchStartX = 0;
    let touchEndX = 0;
    const threshold = 40; // Minimum distance to register as a swipe

    element.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    element.addEventListener('touchend', function (event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchStartX - touchEndX > threshold) {
            onSwipeLeft();
        }
        if (touchEndX - touchStartX > threshold) {
            onSwipeRight();
        }
    }
}

function initializeHeroLandingSlideshow() {
    const container = document.querySelector('.header-home');
    const slides = document.querySelectorAll('.hero-landing-slide');
    const dots = container ? container.querySelectorAll('.slide-indicators .dot') : [];
    if (!slides.length) return;

    let currentSlide = 0;
    let slideInterval;

    function updateSlide() {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlide].classList.add('active');
        if (dots.length) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide();
    }

    function setSlide(index) {
        currentSlide = index;
        updateSlide();
        startInterval();
    }

    function startInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    if (dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => setSlide(index));
        });
    }

    startInterval();

    // Add swipe functionality for touch devices
    if (container) {
        addSwipeListener(container, () => {
            nextSlide();
            startInterval();
        }, () => {
            prevSlide();
            startInterval();
        });
    }
}

function initializeMainSlideshow() {
    const buildingProjectsSection = document.querySelector('.building-projects-section');
    const slideshowScope = buildingProjectsSection || document;
    const slides = slideshowScope.querySelectorAll('.hero-section .slide');
    const dots = slideshowScope.querySelectorAll('.hero-section .dot');
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroContent = document.querySelector('.hero-section .hero-content');
    const previousButton = buildingProjectsSection ? buildingProjectsSection.querySelector('.project-prev') : null;
    const nextButton = buildingProjectsSection ? buildingProjectsSection.querySelector('.project-next') : null;

    if (!slides.length || !dots.length) return;

    const slideData = buildingProjectsSection
        ? Array.from(slides).map(function (slide) {
            slide.style.backgroundImage = "url('" + slide.dataset.image + "')";
            return {
                title: slide.dataset.title,
                subtitle: slide.dataset.subtitle
            };
        })
        : [
            { title: 'Structural Framing', subtitle: 'In progress' },
            { title: 'Building Construction', subtitle: 'Not available yet' },
            { title: 'Completed Development', subtitle: 'handed to client' }
        ];
    let currentSlideIndex = 0;
    let slideInterval;

    function updateSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');

        if (heroContent && heroTitle && heroSubtitle) {
            heroContent.classList.remove('fade');
            setTimeout(function () {
                heroTitle.textContent = slideData[index].title;
                heroSubtitle.textContent = slideData[index].subtitle;
                heroContent.classList.add('fade');
            }, 50);
        }
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        updateSlide(currentSlideIndex);
    }

    function changeSlide(index) {
        currentSlideIndex = index;
        updateSlide(currentSlideIndex);
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    function moveSlide(direction) {
        currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;
        updateSlide(currentSlideIndex);
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            changeSlide(index);
        });
    });

    if (previousButton && nextButton) {
        previousButton.addEventListener('click', function () {
            moveSlide(-1);
        });
        nextButton.addEventListener('click', function () {
            moveSlide(1);
        });
    }

    slideInterval = setInterval(nextSlide, 5000);

    // Add swipe functionality for touch devices
    const heroSection = slideshowScope.querySelector('.hero-section');
    if (heroSection) {
        addSwipeListener(heroSection, () => {
            moveSlide(1);
        }, () => {
            moveSlide(-1);
        });
    }
}

function initializeAdvertSlideshow() {
    const slides = document.querySelectorAll('.ad-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const container = document.querySelector('.ad-carousel-container');
    const dots = container ? container.querySelectorAll('.slide-indicators .dot') : [];

    if (!slides.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let autoPlayInterval;

    function updateDots() {
        if (dots.length) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }
    }

    function flipSlide(direction) {
        slides.forEach(slide => slide.classList.remove('active', 'outgoing'));
        slides[currentIndex].classList.add('outgoing');
        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        slides[currentIndex].classList.add('active');
        updateDots();
    }

    function setSlide(index) {
        if (index === currentIndex) return;
        slides.forEach(slide => slide.classList.remove('active', 'outgoing'));
        slides[currentIndex].classList.add('outgoing');
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        updateDots();
        resetAutoPlay();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(function () {
            flipSlide(1);
        }, 4000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    prevBtn.addEventListener('click', function () {
        flipSlide(-1);
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', function () {
        flipSlide(1);
        resetAutoPlay();
    });

    if (dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => setSlide(index));
        });
    }

    startAutoPlay();

    // Add swipe functionality for touch devices
    if (container) {
        addSwipeListener(container, () => {
            flipSlide(1);
            resetAutoPlay();
        }, () => {
            flipSlide(-1);
            resetAutoPlay();
        });
    }
}

// Transform pure CSS galleries into JS controllable slideshows to support swiping
function initializeGallerySlideshows() {
    const galleries = document.querySelectorAll('.slideshow, .slideshow-single');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        const dots = gallery.querySelectorAll('.slide-indicators .dot');
        if (images.length <= 1) return;

        let currentIndex = 0;
        let autoPlayInterval;

        // Override CSS animations with JavaScript control
        images.forEach((img, index) => {
            img.style.animation = 'none';
            img.style.opacity = index === 0 ? '1' : '0';
            img.style.transition = 'opacity 0.8s ease-in-out';
        });

        function showImage(index) {
            images.forEach(img => img.style.opacity = '0');
            images[index].style.opacity = '1';
            if (dots.length) {
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');
            }
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        }

        function setSlide(index) {
            currentIndex = index;
            showImage(currentIndex);
            startAutoPlay();
        }

        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextImage, 5000);
        }

        if (dots.length) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => setSlide(index));
            });
        }

        startAutoPlay();

        // Add swipe functionality for touch devices
        addSwipeListener(gallery, () => {
            nextImage();
            startAutoPlay();
        }, () => {
            prevImage();
            startAutoPlay();
        });
    });
}

function initializeChatbot() {
    const launcher = document.getElementById('chatbotLauncher');
    const container = document.getElementById('chatbotContainer');
    const header = document.getElementById('chatbotHeader');
    const closeButton = document.querySelector('.chat-close');

    if (!launcher || !container) return;

    launcher.addEventListener('click', function (event) {
        event.preventDefault();
        toggleChatbot();
    });

    launcher.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleChatbot();
        }
    });

    if (closeButton) {
        closeButton.addEventListener('click', function (event) {
            event.stopPropagation();
            closeChatbot();
        });
    }

    if (header) makeDraggable(container, header);

    function toggleChatbot() {
        if (container.classList.contains('active')) {
            closeChatbot();
        } else {
            container.classList.add('active');
            launcher.classList.add('active');
            container.style.display = 'flex';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            showTypingIndicator();
        }
    }

    function closeChatbot() {
        container.classList.remove('active');
        launcher.classList.remove('active');
        container.style.display = 'none';
        container.style.visibility = 'hidden';
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.classList.remove('active');
    }

    function showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        const body = document.getElementById('chatBody');
        if (!indicator || !body) return;

        indicator.classList.add('active');
        clearTimeout(window.chatTypingTimer);
        window.chatTypingTimer = setTimeout(function () {
            indicator.classList.remove('active');
            if (!document.getElementById('chatFollowUp')) {
                const followUp = document.createElement('div');
                followUp.className = 'message msg-ai';
                followUp.id = 'chatFollowUp';
                followUp.textContent = 'We typically reply within one business day. What would you like to know about your project?';
                body.appendChild(followUp);
            }
        }, 1100);
    }

    function makeDraggable(element, handle) {
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.addEventListener('pointerdown', function (event) {
            if (event.target.closest('.chat-close')) return;
            dragging = true;
            element.classList.add('dragging');
            const rect = element.getBoundingClientRect();
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;
            handle.setPointerCapture(event.pointerId);
        });

        handle.addEventListener('pointermove', function (event) {
            if (!dragging) return;
            const maxLeft = window.innerWidth - element.offsetWidth - 12;
            const maxTop = window.innerHeight - element.offsetHeight - 12;
            const left = Math.max(12, Math.min(event.clientX - offsetX, maxLeft));
            const top = Math.max(12, Math.min(event.clientY - offsetY, maxTop));
            element.style.left = left + 'px';
            element.style.top = top + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        });

        function stopDragging(event) {
            if (!dragging) return;
            dragging = false;
            element.classList.remove('dragging');
            if (event.pointerId !== undefined) {
                try { handle.releasePointerCapture(event.pointerId); } catch (error) {}
            }
        }

        handle.addEventListener('pointerup', stopDragging);
        handle.addEventListener('pointercancel', stopDragging);
    }
}