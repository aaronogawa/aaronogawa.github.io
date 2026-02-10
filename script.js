document.addEventListener('DOMContentLoaded', function() {
    // Prevent right-click save on all images
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });

    // Dark mode: restore from localStorage and wire toggle
    var darkModeKey = 'aaron-ogawa-dark-mode';
    function isDarkMode() {
        return document.documentElement.classList.contains('dark-mode');
    }
    function setDarkMode(on) {
        var el = document.documentElement;
        var body = document.body;
        if (on) {
            el.classList.add('dark-mode');
            if (body) body.classList.add('dark-mode');
            document.querySelectorAll('.dark-mode-toggle').forEach(function(btn) {
                if (!btn) return;
                btn.setAttribute('aria-pressed', 'true');
                var moonImg = btn.querySelector('.dark-mode-moon-img');
                var sunSpan = btn.querySelector('.dark-mode-sun-icon');
                if (moonImg) moonImg.style.display = 'none';
                if (sunSpan) { sunSpan.style.display = ''; sunSpan.textContent = '\u2600'; }
            });
        } else {
            el.classList.remove('dark-mode');
            if (body) body.classList.remove('dark-mode');
            document.querySelectorAll('.dark-mode-toggle').forEach(function(btn) {
                if (!btn) return;
                btn.setAttribute('aria-pressed', 'false');
                var moonImg = btn.querySelector('.dark-mode-moon-img');
                var sunSpan = btn.querySelector('.dark-mode-sun-icon');
                if (moonImg) moonImg.style.display = '';
                if (sunSpan) sunSpan.style.display = 'none';
            });
        }
        try { localStorage.setItem(darkModeKey, on ? '1' : '0'); } catch (e) {}
    }
    try {
        var stored = localStorage.getItem(darkModeKey);
        if (stored === '1') setDarkMode(true);
    } catch (e) {}
    document.querySelectorAll('.dark-mode-toggle').forEach(function(btn) {
        if (!btn) return;
        btn.addEventListener('click', function() {
            setDarkMode(!isDarkMode());
        });
    });

    // Mobile menu: toggle menu open/close when MENU button is clicked; sync both navbars
    var menuButtons = document.querySelectorAll('.nav-menu-btn');
    var body = document.body;
    function closeMenu() {
        body.classList.remove('menu-open');
        body.style.overflow = '';
        menuButtons.forEach(function(btn) {
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }
    function openMenu() {
        body.classList.add('menu-open');
        body.style.overflow = 'hidden';
        menuButtons.forEach(function(btn) {
            if (btn) btn.setAttribute('aria-expanded', 'true');
        });
    }
    menuButtons.forEach(function(btn) {
        if (!btn) return;
        btn.addEventListener('click', function() {
            if (body.classList.contains('menu-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    });
    document.querySelectorAll('.nav-menu-close').forEach(function(btn) {
        if (btn) btn.addEventListener('click', closeMenu);
    });

    // Gallery photos: 0.2s fade-in when each image finishes loading (desktop and mobile)
    function setupGalleryPhotoFadeIn() {
        document.querySelectorAll('.music-gallery .music-photo img').forEach(function(img) {
            if (img.classList.contains('loaded')) return;
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    img.classList.add('loaded');
                }, { once: true });
            }
        });
    }
    setupGalleryPhotoFadeIn();

    // Mobile gallery: reorder photos left-to-right per row, then top-to-bottom (same as desktop reading order)
    var mobileGalleryMedia = window.matchMedia('(max-width: 768px)');
    function applyMobileGalleryOrder() {
        var sections = document.querySelectorAll('.music-gallery.gallery-music, .music-gallery.gallery-aspect-3-2.gallery-music');
        var isMobile = mobileGalleryMedia.matches;
        sections.forEach(function(section) {
            if (isMobile) {
                if (section._galleryFlattened) return;
                var columns = section.querySelectorAll('.gallery-column');
                if (!columns.length) return;
                var maxRows = 0;
                columns.forEach(function(col) {
                    var count = col.querySelectorAll('.music-photo').length;
                    if (count > maxRows) maxRows = count;
                });
                var ordered = [];
                var mapping = [];
                for (var row = 0; row < maxRows; row++) {
                    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                        var photos = columns[colIndex].querySelectorAll('.music-photo');
                        if (photos[row]) {
                            ordered.push(photos[row]);
                            mapping.push({ colIndex: colIndex, rowIndex: row });
                        }
                    }
                }
                columns.forEach(function(col) { col.remove(); });
                ordered.forEach(function(photo) { section.appendChild(photo); });
                section._galleryFlattened = true;
                section._galleryOriginalColumns = Array.from(columns);
                section._galleryPhotoMapping = mapping;
                section._galleryOrderedPhotos = ordered;
            } else {
                if (!section._galleryFlattened) return;
                var ordered = section._galleryOrderedPhotos;
                var mapping = section._galleryPhotoMapping;
                var columns = section._galleryOriginalColumns;
                var columnsContent = columns.map(function() { return []; });
                ordered.forEach(function(photo, i) {
                    var colIndex = mapping[i].colIndex;
                    var rowIndex = mapping[i].rowIndex;
                    columnsContent[colIndex][rowIndex] = photo;
                });
                ordered.forEach(function(photo) { photo.remove(); });
                columns.forEach(function(col, colIndex) {
                    var photos = columnsContent[colIndex].filter(Boolean);
                    photos.forEach(function(photo) { col.appendChild(photo); });
                });
                columns.forEach(function(col) { section.appendChild(col); });
                section._galleryFlattened = false;
                section._galleryOriginalColumns = null;
                section._galleryPhotoMapping = null;
                section._galleryOrderedPhotos = null;
            }
        });
        setupGalleryPhotoFadeIn();
    }
    applyMobileGalleryOrder();
    mobileGalleryMedia.addEventListener('change', applyMobileGalleryOrder);

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

        var autoAdvanceInterval;
        function startAutoAdvance() {
            if (autoAdvanceInterval) clearInterval(autoAdvanceInterval);
            autoAdvanceInterval = setInterval(nextSlide, 5000);
        }
        startAutoAdvance();

        const carouselPrev = document.querySelector('.carousel-prev');
        const carouselNext = document.querySelector('.carousel-next');
        if (carouselPrev) carouselPrev.addEventListener('click', function(e) { e.preventDefault(); prevSlide(); startAutoAdvance(); });
        if (carouselNext) carouselNext.addEventListener('click', function(e) { e.preventDefault(); nextSlide(); startAutoAdvance(); });

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
