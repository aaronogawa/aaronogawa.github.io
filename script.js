document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const navbarTop = document.querySelector('.navbar-top');
    const navbarFixed = document.querySelector('.navbar-fixed');
    const carouselContainer = document.querySelector('.carousel-container');
    let currentSlide = 0;

    // Function to switch to a tab
    function switchToTab(targetTab) {
        // Remove active class from all tabs and contents
        tabLinks.forEach(l => l.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to target tab and corresponding content (both navbars)
        document.querySelectorAll(`.tab-link[data-tab="${targetTab}"]`).forEach(el => el.classList.add('active'));
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // Show/hide carousel based on active tab
        if (targetTab === 'home') {
            carouselContainer.classList.remove('hidden');
            if (navbarTop) navbarTop.classList.remove('on-white-page');
            setTimeout(() => handleScroll(), 100);
        } else {
            carouselContainer.classList.add('hidden');
            if (navbarTop) navbarTop.classList.add('on-white-page');
            if (navbarFixed) navbarFixed.classList.remove('visible');
        }
        
        // Scroll to top when switching tabs
        window.scrollTo(0, 0);
    }

    // Logo and tab links (both navbars)
    document.querySelectorAll('.logo-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchToTab(this.getAttribute('data-tab'));
        });
    });
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            switchToTab(targetTab);
        });
    });

    // Background carousel functionality
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

    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Carousel prev/next button clicks
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    if (carouselPrev) {
        carouselPrev.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
        });
    }
    if (carouselNext) {
        carouselNext.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
        });
    }

    // Hysteresis: avoid toggling navbar at exact threshold when scrolling slowly (so fade always runs)
    const NAVBAR_BUFFER = 40;
    let navbarVisible = false;
    let navbarHideTimeout = null;

    // Only apply hidden-after-fade after opacity transition ends (so scroll-up fade-out is always visible)
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

    // Fixed navbar fades in when scrolled past carousel; hide carousel when in next section
    function handleScroll() {
        const scrollPosition = window.scrollY;
        const isHomePage = document.getElementById('home') && document.getElementById('home').classList.contains('active');
        const carouselVisible = isHomePage && !carouselContainer.classList.contains('hidden');
        
        // On home page: carousel hide/show with same hysteresis so it never suddenly appears/disappears
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
        } else {
            carouselContainer.classList.remove('scrolled-past');
        }
        
        // Fixed navbar: show when scrolled past first full screen (with hysteresis)
        if (!navbarFixed) return;
        let threshold = 100;
        if (carouselVisible) {
            threshold = window.innerHeight * 0.95;
        }
        const showThreshold = threshold + NAVBAR_BUFFER;
        const hideThreshold = threshold - NAVBAR_BUFFER; /* symmetric hysteresis: neither part suddenly appears */
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
                // Force a frame with opacity 0 so the transition to 1 runs (fixes instant appear on slow scroll down)
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
                // Use transitionend so visibility:hidden is applied only after fade-out finishes (fixes instant disappear on slow scroll up)
                navbarFixed.addEventListener('transitionend', onNavbarOpacityTransitionEnd);
                // Fallback if transitionend never fires (e.g. opacity already 0)
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
    handleScroll(); // Check initial state

    // Restore homepage: carousel visible and full-screen when first opening the site
    const activeTab = document.querySelector('.tab-link.active');
    const activeContent = document.querySelector('.tab-content.active');
    const isHomeOnLoad = (activeContent && activeContent.id === 'home') ||
        (activeTab && activeTab.getAttribute('data-tab') === 'home');

    if (isHomeOnLoad) {
        carouselContainer.classList.remove('hidden');
        carouselContainer.classList.remove('scrolled-past'); // ensure full-screen carousel on first view
        if (navbarTop) navbarTop.classList.remove('on-white-page');
    } else {
        carouselContainer.classList.add('hidden');
        if (navbarTop) navbarTop.classList.add('on-white-page');
    }
});
