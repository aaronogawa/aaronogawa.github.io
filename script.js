document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const navbar = document.querySelector('.navbar');
    const carouselContainer = document.querySelector('.carousel-container');
    const logoLink = document.querySelector('.logo-link');
    let currentSlide = 0;

    // Function to switch to a tab
    function switchToTab(targetTab) {
        // Remove active class from all tabs and contents
        tabLinks.forEach(l => l.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to target tab and corresponding content
        const targetTabLink = document.querySelector(`.tab-link[data-tab="${targetTab}"]`);
        if (targetTabLink) {
            targetTabLink.classList.add('active');
        }
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // Show/hide carousel based on active tab
        if (targetTab === 'home') {
            carouselContainer.classList.remove('hidden');
            navbar.classList.remove('on-white-page'); // Remove class for home page
            // Reset scroll position and check navbar state
            setTimeout(() => {
                handleScroll();
            }, 100);
        } else {
            carouselContainer.classList.add('hidden');
            navbar.classList.add('on-white-page'); // Add class for non-home pages
            navbar.classList.remove('scrolled'); // Keep navbar transparent on other pages
        }
        
        // Scroll to top when switching tabs
        window.scrollTo(0, 0);
    }

    // Logo link functionality
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            switchToTab(targetTab);
        });
    }

    // Tab switching functionality
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

    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);

    let lastScrollTop = 0;
    let scrollDirection = 'down';
    const fadeOutThreshold = 100; // Scroll down this much to fade out

    // Handle navbar appearance on scroll
    function handleScroll() {
        const scrollPosition = window.scrollY;
        const isHomePage = document.getElementById('home') && document.getElementById('home').classList.contains('active');
        
        // Determine scroll direction
        if (scrollPosition > lastScrollTop) {
            scrollDirection = 'down';
        } else if (scrollPosition < lastScrollTop) {
            scrollDirection = 'up';
        }
        lastScrollTop = scrollPosition;
        
        // At the very top, always show navbar
        if (scrollPosition <= 10) {
            navbar.classList.remove('fade-out');
            navbar.classList.add('fade-in');
            if (isHomePage) {
                navbar.classList.remove('scrolled');
            }
            return;
        }
        
        // Get fade-in threshold - use carousel height on home page, default for others
        let fadeInThreshold = 200; // Default threshold for other pages
        if (isHomePage && !carouselContainer.classList.contains('hidden')) {
            fadeInThreshold = carouselContainer.offsetHeight - 50;
        }
        
        // Handle fade in/out based on scroll position and direction
        if (scrollDirection === 'down') {
            // Scrolling down
            if (scrollPosition > fadeOutThreshold && scrollPosition < fadeInThreshold) {
                // Fade out
                navbar.classList.add('fade-out');
                navbar.classList.remove('fade-in');
            } else if (scrollPosition >= fadeInThreshold) {
                // Fade back in after scrolling past carousel (or threshold)
                navbar.classList.remove('fade-out');
                navbar.classList.add('fade-in');
            }
        } else if (scrollDirection === 'up') {
            // Scrolling up
            if (scrollPosition >= fadeInThreshold) {
                // Keep it visible when scrolling up past fade-in threshold
                navbar.classList.remove('fade-out');
                navbar.classList.add('fade-in');
            } else if (scrollPosition > fadeOutThreshold && scrollPosition < fadeInThreshold) {
                // Fade out when scrolling back up to fade-out zone
                navbar.classList.add('fade-out');
                navbar.classList.remove('fade-in');
            } else {
                // Show when scrolling back to top
                navbar.classList.remove('fade-out');
                navbar.classList.add('fade-in');
            }
        }
        
        // Handle background color
        if (isHomePage && !carouselContainer.classList.contains('hidden')) {
            // On home page, show white background after scrolling past carousel
            const carouselHeight = carouselContainer.offsetHeight;
            if (scrollPosition >= carouselHeight - 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        } else {
            // On other pages, always show white background when scrolled
            if (scrollPosition > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    // Set initial navbar state based on active tab
    const activeTab = document.querySelector('.tab-link.active');
    const activeContent = document.querySelector('.tab-content.active');
    
    // Check if home section is active (default)
    if (activeContent && activeContent.id === 'home') {
        carouselContainer.classList.remove('hidden');
        navbar.classList.remove('on-white-page');
    } else if (activeTab) {
        const activeTabName = activeTab.getAttribute('data-tab');
        if (activeTabName === 'home') {
            carouselContainer.classList.remove('hidden');
            navbar.classList.remove('on-white-page');
        } else {
            carouselContainer.classList.add('hidden');
            navbar.classList.add('on-white-page');
        }
    } else {
        // Default to Home page (with carousel)
        carouselContainer.classList.remove('hidden');
        navbar.classList.remove('on-white-page');
    }
});
