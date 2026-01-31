document.addEventListener('DOMContentLoaded', function() {
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const navbarFixed = document.querySelector('.navbar-fixed');
    const carouselContainer = document.querySelector('.carousel-container');
    const navbarTop = document.querySelector('.navbar-top');
    const isHomePage = !!document.getElementById('home');

    // Carousel logic (home page only)
    if (isHomePage && carouselSlides.length) {
        let currentSlide = 0;

        function nextSlide() {
            carouselSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % carouselSlides.length;
            carouselSlides[currentSlide].classList.add('active');
        }

        function prevSlide() {
            carouselSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
            carouselSlides[currentSlide].classList.add('active');
        }

        setInterval(nextSlide, 5000);

        const carouselPrev = document.querySelector('.carousel-prev');
        const carouselNext = document.querySelector('.carousel-next');
        if (carouselPrev) carouselPrev.addEventListener('click', function(e) { e.preventDefault(); prevSlide(); });
        if (carouselNext) carouselNext.addEventListener('click', function(e) { e.preventDefault(); nextSlide(); });

        // Initial state: carousel visible
        if (carouselContainer) {
            carouselContainer.classList.remove('hidden');
            carouselContainer.classList.remove('scrolled-past');
        }
        if (navbarTop) navbarTop.classList.remove('on-white-page');
    }

    // Fixed navbar scroll logic (all pages)
    if (!navbarFixed) return;

    const NAVBAR_BUFFER = 40;
    let navbarVisible = false;
    let navbarHideTimeout = null;

    function onNavbarOpacityTransitionEnd(e) {
        if (e.target !== navbarFixed || e.propertyName !== 'opacity') return;
        if (navbarHideTimeout) {
            clearTimeout(navbarHideTimeout);
            navbarHideTimeout = null;
        }
        if (!navbarFixed.classList.contains('visible')) {
            navbarFixed.classList.add('hidden-after-fade');
        }
        navbarFixed.removeEventListener('transitionend', onNavbarOpacityTransitionEnd);
    }

    function handleScroll() {
        const scrollPosition = window.scrollY;
        const carouselVisible = isHomePage && carouselContainer && !carouselContainer.classList.contains('hidden');

        // Home page: hide carousel when scrolled past
        if (carouselVisible) {
            const viewportHeight = window.innerHeight;
            const carouselThreshold = viewportHeight * 0.95;
            const carouselShowAt = carouselThreshold - NAVBAR_BUFFER;
            const carouselHideAt = carouselThreshold + NAVBAR_BUFFER;
            if (scrollPosition >= carouselHideAt) {
                carouselContainer.classList.add('scrolled-past');
            } else if (scrollPosition < carouselShowAt) {
                carouselContainer.classList.remove('scrolled-past');
            }
        }

        // Fixed navbar: show at same scroll distance on all pages (95% of viewport)
        const threshold = window.innerHeight * 0.95;
        const showThreshold = threshold + NAVBAR_BUFFER;
        const hideThreshold = threshold - NAVBAR_BUFFER;

        if (scrollPosition >= showThreshold) {
            if (navbarHideTimeout) {
                clearTimeout(navbarHideTimeout);
                navbarHideTimeout = null;
            }
            navbarFixed.removeEventListener('transitionend', onNavbarOpacityTransitionEnd);
            if (!navbarVisible) {
                navbarVisible = true;
                navbarFixed.classList.remove('hidden-after-fade');
                navbarFixed.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        if (navbarVisible) navbarFixed.classList.add('visible');
                    });
                });
            }
        } else if (scrollPosition < hideThreshold) {
            if (navbarVisible) {
                navbarVisible = false;
                navbarFixed.classList.remove('visible');
                navbarFixed.setAttribute('aria-hidden', 'true');
                navbarFixed.addEventListener('transitionend', onNavbarOpacityTransitionEnd);
                navbarHideTimeout = setTimeout(function() {
                    navbarHideTimeout = null;
                    navbarFixed.removeEventListener('transitionend', onNavbarOpacityTransitionEnd);
                    if (!navbarFixed.classList.contains('visible')) {
                        navbarFixed.classList.add('hidden-after-fade');
                    }
                }, 250);
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
});
