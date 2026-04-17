// All pages: page-leaving fade-out (runs before DOMContentLoaded to ensure it always attaches)
document.addEventListener('click', function(e) {
    var link = e.target.closest ? e.target.closest('a.tab-link') : null;
    if (!link) {
        var el = e.target;
        while (el && el.tagName !== 'A') el = el.parentElement;
        link = el && el.classList.contains('tab-link') ? el : null;
    }
    if (!link) return;
    var nav = link.parentElement;
    while (nav && !nav.classList.contains('navbar')) nav = nav.parentElement;
    if (!nav) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    var cur = (window.location.pathname.split('/').pop() || 'index.html');
    if (href === cur) return;
    e.preventDefault();
    if (cur === 'index.html') { window.location.href = href; return; }
    document.body.classList.add('page-leaving');
    setTimeout(function() { window.location.href = href; }, 380);
});

document.addEventListener('DOMContentLoaded', function() {
    // Reverse scroll-down animation when returning from a works subpage
    (function() {
        try {
            if (sessionStorage.getItem('works-scroll-enter') !== '1') return;
            sessionStorage.removeItem('works-scroll-enter');
        } catch(err) { return; }
        var scrollIndicator = document.querySelector('.scroll-down-indicator');
        if (!scrollIndicator) return;
        scrollIndicator.style.animation = 'none';
        scrollIndicator.offsetHeight;
        scrollIndicator.style.animation = 'scroll-down-enter 0.55s ease both';
    })();

    // Reveal nav once layout is stable (avoids split-second resize from font load)
    function markNavReady() {
        document.body.classList.add('nav-ready');
    }
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(markNavReady);
        setTimeout(markNavReady, 150);
    } else {
        requestAnimationFrame(function() { requestAnimationFrame(markNavReady); });
    }

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
        if (stored === '0') setDarkMode(false);
        else setDarkMode(true);  // default dark on first visit (no preference) or when stored is '1'
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

    // Nav search: expand/collapse on magnifying glass click; sync both nav bars so only one search UI shows
    var allNavContainers = document.querySelectorAll('.nav-container');
    var searchOpenPending = false;
    function closeSearch() {
        searchOpenPending = false;
        allNavContainers.forEach(function(container) {
            container.classList.remove('search-open', 'search-has-query');
            var input = container.querySelector('.nav-search-input');
            if (input) input.value = '';
        });
        document.querySelectorAll('.nav-search-expanded').forEach(function(ex) {
            ex.classList.remove('has-query');
        });
        document.querySelectorAll('.nav-search-suggestions').forEach(function(el) {
            el.classList.remove('nav-search-suggestions-visible');
        });
        document.querySelectorAll('.nav-search-btn').forEach(function(btn) {
            btn.setAttribute('aria-expanded', 'false');
        });
    }
    function openSearch(clickedContainer) {
        if (!clickedContainer) return;
        if (searchOpenPending) return;
        searchOpenPending = true;
        allNavContainers.forEach(function(c) { c.classList.add('search-open'); });
        document.querySelectorAll('.nav-search-btn').forEach(function(b) { b.setAttribute('aria-expanded', 'true'); });
        var input = clickedContainer.querySelector('.nav-search-input');
        if (input) input.focus();
        searchOpenPending = false;
    }
    document.querySelectorAll('.nav-search-btn').forEach(function(btn) {
        if (!btn) return;
        btn.addEventListener('click', function() {
            var wrap = btn.closest('.nav-search-wrap');
            var container = wrap && wrap.closest('.nav-container');
            if (!container) return;
            // If already open or an open is pending, treat as close (handles fast double-click)
            if (container.classList.contains('search-open') || searchOpenPending) {
                closeSearch();
            } else {
                openSearch(container);
            }
        });
    });
    document.querySelectorAll('.nav-search-close').forEach(function(btn) {
        if (!btn) return;
        btn.addEventListener('click', function() {
            closeSearch();
        });
    });
    document.querySelectorAll('.nav-search-input').forEach(function(input) {
        if (!input) return;
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeSearch();
        });
    });

    // Search suggestions: page list and filter
    // Edit the "description" of each page to change the subtitle shown in the search box.
    var searchPages = [
        { title: 'Home', url: 'index.html', keywords: ['home', 'index'], description: 'Back to the main page' },
        { title: 'About', url: 'about.html', keywords: ['about', 'bio', 'me', 'info'], description: 'Some info about me!' },
        { title: 'Music', url: 'works.html#music', keywords: ['music', 'gigs', 'concerts', 'bands'], description: 'Concerts, bands, everything music related I have shot' },
        { title: 'Portraiture', url: 'portraiture.html', keywords: ['portraiture', 'portrait', 'portraits', 'photos', 'photography', 'pictures'], description: 'Personal and professional portraits' },
        { title: 'Design', url: 'design.html', keywords: ['design', 'graphic', 'visuals', 'branding'], description: 'Posters, packaging, everything design related'},
        { title: 'Automotive', url: 'automotive.html', keywords: ['automotive', 'auto', 'cars'], description: 'Car photography from Los Angeles and beyond'},
        { title: 'Highlights', url: 'works.html#highlights', keywords: ['highlights', 'featured', 'best'], description: 'Highlighted and featured work' },
        { title: 'Sports', url: 'works.html#sports', keywords: ['sports', 'athletics', 'games', 'campus'], description: 'Sports and campus event photography' },
        { title: 'Illustrations', url: 'works.html#illustrations', keywords: ['illustrations', 'drawing', 'art', 'sketch', 'comic'], description: 'Illustrations and drawing-related work' },
        { title: 'Events', url: 'works.html#events', keywords: ['event', 'events', 'campus', 'coverage'], description: 'Event and campus coverage photography' },
        { title: 'Index', url: 'works/index.html', keywords: ['index', 'works index', 'list', 'catalog'], description: 'Works index' },
        { title: 'Asterism', url: 'works/asterism.html', keywords: ['asterism', 'music', 'band'], description: 'Asterism photographs' },
        { title: 'Bigfish Country', url: 'works/bigfish-country.html', keywords: ['bigfish country', 'music', 'concert'], description: 'Bigfish Country photographs' },
        { title: 'Phone Portraits', url: 'works/phone.html', keywords: ['phone', 'portraiture', 'portraits', 'phone portraits'], description: 'Portraits captured on phone' },
        { title: 'Elan Daiso', url: 'works/elan-daiso.html', keywords: ['elan daiso', 'daiso', 'portraiture', 'portraits'], description: 'Elan portrait set at Daiso' },
        { title: 'Elan H Mart', url: 'works/elan-h-mart.html', keywords: ['elan h mart', 'h mart', 'portraiture', 'portraits'], description: 'Elan portrait set at H Mart' },
        { title: 'Alex Little Tokyo', url: 'works/alex-little-tokyo.html', keywords: ['alex little tokyo', 'alex', 'little tokyo', 'portraiture', 'portraits'], description: 'Alex portrait set in Little Tokyo' },
        { title: 'Elan Train', url: 'works/elan-train.html', keywords: ['elan train', 'train', 'portraiture', 'portraits'], description: 'Elan portrait set by train' },
        { title: 'Everything', url: 'extra.html', keywords: ['everything', 'extra'], description: 'All my works in one place'},
        { title: 'Contact', url: 'contact.html', keywords: ['contact', 'email', 'message', 'reach'], description: 'Reach out about any inquiries or projects!'}
    ];
    // Merge per-page keywords from <meta name="search-keywords" content="word1, word2"> on the current page
    (function mergePageSearchKeywords() {
        var meta = document.querySelector('meta[name="search-keywords"]');
        if (!meta || !meta.getAttribute('content')) return;
        var path = window.location.pathname || '';
        var currentFile = path.split('/').pop() || path || 'index.html';
        if (currentFile === '') currentFile = 'index.html';
        var extra = meta.getAttribute('content').split(',').map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);
        var page = searchPages.filter(function(p) {
            var url = p && p.url ? String(p.url) : '';
            return url === currentFile || url.split('/').pop() === currentFile;
        })[0];
        if (page) {
            var seen = {};
            (page.keywords || []).forEach(function(k) { seen[k] = true; });
            extra.forEach(function(k) { if (!seen[k]) { seen[k] = true; page.keywords.push(k); } });
        }
    })();
    var currentSearchQuery = '';
    function pageMatchesQuery(page, query) {
        var q = (String(query || '').trim()).toLowerCase();
        if (q.length === 0) return false;
        var titleLower = (String(page.title || '')).toLowerCase();
        if (titleLower.indexOf(q) !== -1) return true;
        var keywords = page.keywords || [];
        for (var i = 0; i < keywords.length; i++) {
            if ((String(keywords[i])).toLowerCase().indexOf(q) !== -1) return true;
        }
        return false;
    }
    function filterSearchPages(query) {
        var q = (query || '').trim().toLowerCase();
        if (q.length === 0) return [];
        var out = [];
        for (var i = 0; i < searchPages.length; i++) {
            if (pageMatchesQuery(searchPages[i], q)) out.push(searchPages[i]);
        }
        return out;
    }
    function getCanonicalSearchQuery() {
        var inputs = document.querySelectorAll('.nav-search-input');
        for (var i = 0; i < inputs.length; i++) {
            var v = (inputs[i].value || '').trim();
            if (v.length > 0) return v;
        }
        return '';
    }
    // Convert dataset URLs (treated as "site-root relative") into the correct relative URL
    // for the current page, so search works even when you're in `/works/*`.
    function toSiteRootUrl(url) {
        var u = String(url || '');
        if (!u) return u;
        if (u.indexOf('http://') === 0 || u.indexOf('https://') === 0 || u.indexOf('//') === 0) return u;
        if (u.charAt(0) === '#') return u;
        // If it's already a relative/absolute path, trust it.
        if (u.indexOf('../') === 0 || u.indexOf('./') === 0 || u.indexOf('/') === 0) return u;
        var path = (window.location.pathname || '').toLowerCase();
        // Site has root pages and `/works/*` subpages.
        // From any `/works/*` page, go up one level to reach root pages (e.g. index.html).
        if (path.indexOf('/works/') !== -1) return '../' + u;
        if (path.indexOf('/main-pages/') !== -1) return '../' + u;
        return u;
    }
    function isWorksCategoryResult(page) {
        var u = page && page.url ? String(page.url) : '';
        return u.indexOf('main-pages/works.html#') === 0;
    }
    function isWorksSubpageResult(page) {
        var u = page && page.url ? String(page.url) : '';
        return u.indexOf('works/') === 0;
    }
    // On works.html or photography.html, open a category panel by slug without navigating
    function openWorksCategoryPanelIfOnWorks(categorySlug) {
        var path = (window.location.pathname || '').split('/').pop() || '';
        if (path !== 'works.html' && path !== 'photography.html') return false;
        var panel = document.getElementById('works-' + categorySlug + '-panel');
        if (!panel) return false;
        var main = document.querySelector('.works-main-area');
        if (!main) return false;
        var panels = main.querySelectorAll('[id^="works-"][id$="-panel"]');
        panels.forEach(function(el) {
            el.classList.remove('is-visible');
            el.setAttribute('aria-hidden', 'true');
        });
        panel.classList.add('is-visible');
        panel.setAttribute('aria-hidden', 'false');
        window.location.hash = categorySlug;
        return true;
    }
    var worksCategoryByTitle = { 'Music': 'music', 'Portraiture': 'portraiture', 'Design': 'design', 'Automotive': 'automotive', 'Highlights': 'highlights', 'Sports': 'sports', 'Events': 'events' };
    worksCategoryByTitle['Illustrations'] = 'illustrations';
    function setupSearchSuggestions() {
        document.querySelectorAll('.nav-search-expanded').forEach(function(expanded) {
            if (expanded.querySelector('.nav-search-suggestions')) return;
            var row = document.createElement('div');
            row.className = 'nav-search-row';
            var input = expanded.querySelector('.nav-search-input');
            var closeBtn = expanded.querySelector('.nav-search-close');
            if (input) row.appendChild(input);
            var searchSubmitBtn = document.createElement('button');
            searchSubmitBtn.type = 'button';
            searchSubmitBtn.className = 'nav-search-submit';
            searchSubmitBtn.setAttribute('aria-label', 'Search');
            searchSubmitBtn.disabled = true;
            searchSubmitBtn.innerHTML = '<svg class="nav-search-submit-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><span class="nav-search-submit-text">Search</span>';
            row.appendChild(searchSubmitBtn);
            expanded.insertBefore(row, expanded.firstChild);
            var suggestionsEl = document.createElement('div');
            suggestionsEl.className = 'nav-search-suggestions';
            suggestionsEl.setAttribute('role', 'listbox');
            suggestionsEl.setAttribute('aria-label', 'Page suggestions');
            expanded.appendChild(suggestionsEl);
            if (closeBtn) {
                var barWrap = document.createElement('div');
                barWrap.className = 'nav-search-bar-wrap';
                barWrap.appendChild(row);
                barWrap.appendChild(closeBtn);
                expanded.insertBefore(barWrap, suggestionsEl);
            }
            if (!input) return;
            function updateSubmitButton() {
                var hasText = input.value.trim().length > 0;
                searchSubmitBtn.disabled = !hasText;
                searchSubmitBtn.classList.toggle('nav-search-submit--active', hasText);
            }
            function goToFirstMatch() {
                var list = filterSearchPages(input.value);
                if (list.length > 0) window.location.href = toSiteRootUrl(list[0].url);
            }
            searchSubmitBtn.addEventListener('click', function() {
                if (searchSubmitBtn.disabled) return;
                goToFirstMatch();
            });
            function renderSuggestions() {
                currentSearchQuery = (input.value || '').trim();
                var query = currentSearchQuery;
                var list = filterSearchPages(query);
                suggestionsEl.innerHTML = '';
                var hasQuery = query.length > 0;
                suggestionsEl.classList.toggle('nav-search-suggestions-visible', hasQuery);
                expanded.classList.toggle('has-query', hasQuery);
                allNavContainers.forEach(function(c) { c.classList.toggle('search-has-query', hasQuery); });
                if (hasQuery && list.length === 0) {
                    var empty = document.createElement('div');
                    empty.className = 'nav-search-suggestion nav-search-suggestion--empty';
                    empty.setAttribute('role', 'option');
                    empty.textContent = 'No results for “‘ + query + ’”';
                    suggestionsEl.appendChild(empty);
                } else if (hasQuery && list.length > 0) {
                    var categoriesResults = list.filter(isWorksCategoryResult);
                    var worksResults = list.filter(isWorksSubpageResult);
                    var pageResults = list.filter(function(p) {
                        return !isWorksCategoryResult(p) && !isWorksSubpageResult(p);
                    });
                    var isMobileViewport = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
                    var remainingResults = isMobileViewport ? Infinity : 10;
                    var mobileMax = isMobileViewport ? 3 : Infinity;
                    function appendSuggestion(p, container) {
                        if (!pageMatchesQuery(p, query)) return;
                        var a = document.createElement('a');
                        a.href = toSiteRootUrl(p.url);
                        a.className = 'nav-search-suggestion';
                        a.setAttribute('role', 'option');
                        var title = document.createElement('span');
                        title.className = 'nav-search-suggestion-title';
                        title.textContent = p.title;
                        var sub = document.createElement('span');
                        sub.className = 'nav-search-suggestion-sub';
                        sub.textContent = p.description || 'Page';
                        a.appendChild(title);
                        a.appendChild(sub);
                        a.addEventListener('click', function(e) {
                            e.preventDefault();
                            var categorySlug = worksCategoryByTitle[p.title];
                            if (categorySlug && openWorksCategoryPanelIfOnWorks(categorySlug)) {
                                closeSearch();
                                return;
                            }
                            window.location.href = toSiteRootUrl(p.url);
                        });
                        container.appendChild(a);
                    }
                    if (categoriesResults.length > 0 && remainingResults > 0) {
                        var catHeading = document.createElement('div');
                        catHeading.className = 'nav-search-suggestions-heading';
                        catHeading.textContent = 'Categories';
                        suggestionsEl.appendChild(catHeading);
                        var catsSlice = categoriesResults.slice(0, Math.min(remainingResults, mobileMax));
                        catsSlice.forEach(function(p) { appendSuggestion(p, suggestionsEl); });
                        remainingResults -= catsSlice.length;
                    }
                    if (worksResults.length > 0 && remainingResults > 0) {
                        var worksHeading = document.createElement('div');
                        worksHeading.className = 'nav-search-suggestions-heading';
                        worksHeading.textContent = 'Works';
                        suggestionsEl.appendChild(worksHeading);
                        var worksSlice = worksResults.slice(0, Math.min(remainingResults, mobileMax));
                        worksSlice.forEach(function(p) { appendSuggestion(p, suggestionsEl); });
                        remainingResults -= worksSlice.length;
                    }
                    if (pageResults.length > 0 && remainingResults > 0) {
                        var pageHeading = document.createElement('div');
                        pageHeading.className = 'nav-search-suggestions-heading';
                        pageHeading.textContent = 'Pages';
                        suggestionsEl.appendChild(pageHeading);
                        var pagesSlice = pageResults.slice(0, Math.min(remainingResults, mobileMax));
                        pagesSlice.forEach(function(p) { appendSuggestion(p, suggestionsEl); });
                        remainingResults -= pagesSlice.length;
                    }
                }
                if (hasQuery) {
                    function setPanelHeight(el) {
                        el.style.maxHeight = '9999px';
                        el.offsetHeight;
                        var h = el.scrollHeight;
                        el.style.maxHeight = (h + 8) + 'px';
                    }
                    setPanelHeight(suggestionsEl);
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            setPanelHeight(suggestionsEl);
                        });
                    });
                } else {
                    suggestionsEl.style.maxHeight = '';
                }
                updateSubmitButton();
            }
            function syncAllSuggestionPanels() {
                var canonicalQuery = getCanonicalSearchQuery();
                currentSearchQuery = canonicalQuery;
                document.querySelectorAll('.nav-search-expanded').forEach(function(exp) {
                    var inp = exp.querySelector('.nav-search-input');
                    var sug = exp.querySelector('.nav-search-suggestions');
                    if (!inp || !sug) return;
                    var q = canonicalQuery;
                    var list = filterSearchPages(canonicalQuery);
                    sug.innerHTML = '';
                    var hasQ = q.length > 0;
                    sug.classList.toggle('nav-search-suggestions-visible', hasQ);
                    exp.classList.toggle('has-query', hasQ);
                    if (hasQ && list.length === 0) {
                        var empty = document.createElement('div');
                        empty.className = 'nav-search-suggestion nav-search-suggestion--empty';
                        empty.setAttribute('role', 'option');
                        empty.textContent = 'No results for "' + q + '"';
                        sug.appendChild(empty);
                    } else if (hasQ && list.length > 0) {
                        var categoriesResults = list.filter(isWorksCategoryResult);
                        var worksResults = list.filter(isWorksSubpageResult);
                        var pageResults = list.filter(function(p) {
                            return !isWorksCategoryResult(p) && !isWorksSubpageResult(p);
                        });
                        var isMobileViewport = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
                        var remainingResults = isMobileViewport ? Infinity : 10;
                        var mobileMax = isMobileViewport ? 3 : Infinity;
                        function appendSug(p, container) {
                            if (!pageMatchesQuery(p, q)) return;
                            var a = document.createElement('a');
                            a.href = toSiteRootUrl(p.url);
                            a.className = 'nav-search-suggestion';
                            a.setAttribute('role', 'option');
                            var tit = document.createElement('span');
                            tit.className = 'nav-search-suggestion-title';
                            tit.textContent = p.title;
                            var sub = document.createElement('span');
                            sub.className = 'nav-search-suggestion-sub';
                            sub.textContent = p.description || 'Page';
                            a.appendChild(tit);
                            a.appendChild(sub);
                            a.addEventListener('click', function(e) {
                                e.preventDefault();
                                var categorySlug = worksCategoryByTitle[p.title];
                                if (categorySlug && openWorksCategoryPanelIfOnWorks(categorySlug)) {
                                    closeSearch();
                                    return;
                                }
                                window.location.href = toSiteRootUrl(p.url);
                            });
                            container.appendChild(a);
                        }
                        if (categoriesResults.length > 0 && remainingResults > 0) {
                            var catHead = document.createElement('div');
                            catHead.className = 'nav-search-suggestions-heading';
                            catHead.textContent = 'Categories';
                            sug.appendChild(catHead);
                            var catsSlice = categoriesResults.slice(0, Math.min(remainingResults, mobileMax));
                            catsSlice.forEach(function(p) { appendSug(p, sug); });
                            remainingResults -= catsSlice.length;
                        }
                        if (worksResults.length > 0 && remainingResults > 0) {
                            var worksHead = document.createElement('div');
                            worksHead.className = 'nav-search-suggestions-heading';
                            worksHead.textContent = 'Works';
                            sug.appendChild(worksHead);
                            var worksSlice = worksResults.slice(0, Math.min(remainingResults, mobileMax));
                            worksSlice.forEach(function(p) { appendSug(p, sug); });
                            remainingResults -= worksSlice.length;
                        }
                        if (pageResults.length > 0 && remainingResults > 0) {
                            var pageHead = document.createElement('div');
                            pageHead.className = 'nav-search-suggestions-heading';
                            pageHead.textContent = 'Pages';
                            sug.appendChild(pageHead);
                            var pagesSlice = pageResults.slice(0, Math.min(remainingResults, mobileMax));
                            pagesSlice.forEach(function(p) { appendSug(p, sug); });
                            remainingResults -= pagesSlice.length;
                        }
                    }
                    if (hasQ) {
                        sug.style.maxHeight = '9999px';
                        sug.offsetHeight;
                        var h = sug.scrollHeight;
                        sug.style.maxHeight = (h + 8) + 'px';
                    } else {
                        sug.style.maxHeight = '';
                    }
                });
            }
            function syncInputValues(sourceInput) {
                var val = sourceInput && sourceInput.value;
                if (val === undefined) return;
                document.querySelectorAll('.nav-search-input').forEach(function(inp) {
                    if (inp !== sourceInput && inp.value !== val) inp.value = val;
                });
            }
            input.addEventListener('input', function() {
                syncInputValues(input);
                renderSuggestions();
                syncAllSuggestionPanels();
            });
            input.addEventListener('focus', function() {
                syncInputValues(input);
                renderSuggestions();
                syncAllSuggestionPanels();
            });
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (input.value.trim().length > 0) goToFirstMatch();
                }
            });
            input.addEventListener('blur', function() {
                setTimeout(function() {
                    suggestionsEl.style.maxHeight = '0';
                    var onTransitionEnd = function() {
                        suggestionsEl.removeEventListener('transitionend', onTransitionEnd);
                        suggestionsEl.classList.remove('nav-search-suggestions-visible');
                        suggestionsEl.style.maxHeight = '';
                    };
                    suggestionsEl.addEventListener('transitionend', onTransitionEnd);
                    if (getComputedStyle(suggestionsEl).maxHeight === '0px') onTransitionEnd();
                }, 180);
            });
            renderSuggestions();
        });
    }
    setupSearchSuggestions();

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

    // bfcache restore: page was frozen mid-fade, so strip fade classes and show all images.
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            // Remove transition classes left over from navigation fade-out
            var wrapper = document.querySelector('.works-page-wrapper');
            if (wrapper) {
                wrapper.classList.remove('fade-to-asterism', 'fade-to-index');
            }
            document.body.classList.remove('gallery-page-fade-out');
            // Re-show all gallery images
            document.querySelectorAll('.music-gallery .music-photo img').forEach(function(img) {
                img.classList.add('loaded');
            });
        }
    });

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
        const totalSlides = carouselSlides.length;
        const carouselCounters = document.querySelectorAll('.carousel-counter');

        function updateCounters() {
            var label = (currentSlide + 1) + '/' + totalSlides;
            carouselCounters.forEach(function(el) { el.textContent = label; });
        }
        updateCounters();

        function nextSlide() {
            carouselSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            carouselSlides[currentSlide].classList.add('active');
            updateCounters();
        }

        function prevSlide() {
            carouselSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            carouselSlides[currentSlide].classList.add('active');
            updateCounters();
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

    // Everything page: full-width #1b7ad6 bar moves to hovered category (only hide when leaving stack)
    var extraStack = document.querySelector('.extra-stack');
    var extraStackItems = document.querySelectorAll('.extra-stack .extra-stack-item');
    var extraHoverBar = null;
    var extraHideTimeout = null;
    var extraFramesFadeOutTimeout = null;
    var extraPendingCategorySwitchTimeout = null;
    function updateExtraHoverBar(rect) {
        if (!extraHoverBar) {
            extraHoverBar = document.createElement('div');
            extraHoverBar.setAttribute('aria-hidden', 'true');
            extraHoverBar.style.cssText = 'position:fixed;left:0;right:0;background:#1b7ad6;z-index:0;pointer-events:none;transition:top 0.25s ease,height 0.25s ease,opacity 0.2s ease;opacity:0;';
            document.body.appendChild(extraHoverBar);
        }
        if (extraHideTimeout) {
            clearTimeout(extraHideTimeout);
            extraHideTimeout = null;
        }
        if (extraFramesFadeOutTimeout) {
            clearTimeout(extraFramesFadeOutTimeout);
            extraFramesFadeOutTimeout = null;
        }
        if (extraPendingCategorySwitchTimeout) {
            clearTimeout(extraPendingCategorySwitchTimeout);
            extraPendingCategorySwitchTimeout = null;
        }
        extraHoverBar.style.top = rect.top + 'px';
        extraHoverBar.style.height = rect.height + 'px';
        extraHoverBar.style.opacity = '1';
    }
    function hideExtraHoverBar() {
        if (extraHoverBar) extraHoverBar.style.opacity = '0';
    }
    var extraFramesRow = document.querySelector('.extra-frames-row');
    var extraCategorySlugs = Array.prototype.map.call(extraStackItems, function(item) { return item.getAttribute('data-category') || ''; }).filter(Boolean);
    function removeAllExtraCategoryClasses() {
        if (!extraFramesRow) return;
        extraCategorySlugs.forEach(function(slug) { extraFramesRow.classList.remove('category-' + slug); });
    }
    function getCurrentExtraCategory() {
        if (!extraFramesRow) return null;
        for (var i = 0; i < extraCategorySlugs.length; i++) {
            if (extraFramesRow.classList.contains('category-' + extraCategorySlugs[i])) return extraCategorySlugs[i];
        }
        return null;
    }
    function fadeInExtraFrames(frames) {
        if (!frames || !frames.length) return;
        var delays = [0, 1, 2, 3, 4].map(function() { return 0.05 + Math.random() * 0.15; });
        frames.forEach(function(frame, i) {
            frame.style.transitionDelay = (delays[i] || 0) + 's';
            frame.style.opacity = '0';
        });
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                frames.forEach(function(frame) {
                    frame.style.opacity = '';
                });
            });
        });
    }
    function showExtraFramesWithRandomStagger(category) {
        if (!extraFramesRow) return;
        var currentCategory = getCurrentExtraCategory();
        if (currentCategory && currentCategory !== category) {
            if (extraPendingCategorySwitchTimeout) {
                clearTimeout(extraPendingCategorySwitchTimeout);
                extraPendingCategorySwitchTimeout = null;
            }
            var activeInner = extraFramesRow.querySelector('.extra-frames-' + currentCategory);
            var frames = activeInner ? activeInner.querySelectorAll('.extra-frame') : [];
            var fadeOutDelays = [0, 0.02, 0.04, 0.06, 0.08].sort(function() { return Math.random() - 0.5; });
            frames.forEach(function(frame, i) {
                frame.style.transition = 'opacity 0.12s ease';
                frame.style.transitionDelay = (fadeOutDelays[i] || 0) + 's';
                frame.style.opacity = '0';
            });
            var duration = 120 + 80;
            var newCategory = category;
            extraPendingCategorySwitchTimeout = setTimeout(function() {
                extraPendingCategorySwitchTimeout = null;
                removeAllExtraCategoryClasses();
                if (newCategory) extraFramesRow.classList.add('category-' + newCategory);
                extraFramesRow.classList.add('extra-frames-visible');
                var newInner = newCategory ? extraFramesRow.querySelector('.extra-frames-' + newCategory) : null;
                var newFrames = newInner ? newInner.querySelectorAll('.extra-frame') : [];
                fadeInExtraFrames(newFrames);
            }, duration);
        } else {
            if (extraPendingCategorySwitchTimeout) {
                clearTimeout(extraPendingCategorySwitchTimeout);
                extraPendingCategorySwitchTimeout = null;
            }
            removeAllExtraCategoryClasses();
            if (category) extraFramesRow.classList.add('category-' + category);
            extraFramesRow.classList.add('extra-frames-visible');
            var activeInner = category ? extraFramesRow.querySelector('.extra-frames-' + category) : null;
            var frames = activeInner ? activeInner.querySelectorAll('.extra-frame') : [];
            fadeInExtraFrames(frames);
        }
    }
    function hideExtraFrames() {
        if (!extraFramesRow) return;
        var currentCategory = getCurrentExtraCategory();
        var activeInner = currentCategory ? extraFramesRow.querySelector('.extra-frames-' + currentCategory) : null;
        var frames = activeInner ? activeInner.querySelectorAll('.extra-frame') : [];
        if (frames.length) {
            var fadeOutDelays = [0, 0.05, 0.1, 0.15, 0.2];
            frames.forEach(function(frame, i) {
                frame.style.transitionDelay = (fadeOutDelays[i] || 0) + 's';
                frame.style.opacity = '0';
            });
            var duration = 250 + 200;
            extraFramesFadeOutTimeout = setTimeout(function() {
                extraFramesFadeOutTimeout = null;
                extraFramesRow.classList.remove('extra-frames-visible');
                removeAllExtraCategoryClasses();
                extraFramesRow.querySelectorAll('.extra-frame').forEach(function(frame) {
                    frame.style.transitionDelay = '';
                    frame.style.opacity = '';
                });
            }, duration);
        } else {
            extraFramesRow.classList.remove('extra-frames-visible');
            removeAllExtraCategoryClasses();
            extraFramesRow.querySelectorAll('.extra-frame').forEach(function(frame) {
                frame.style.transitionDelay = '';
                frame.style.opacity = '';
            });
        }
    }
    extraStackItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            var rect = item.getBoundingClientRect();
            var category = item.getAttribute('data-category') || '';
            updateExtraHoverBar(rect);
            showExtraFramesWithRandomStagger(category);
        });
    });
    if (extraStack) {
        extraStack.addEventListener('mouseleave', function() {
            if (extraPendingCategorySwitchTimeout) {
                clearTimeout(extraPendingCategorySwitchTimeout);
                extraPendingCategorySwitchTimeout = null;
            }
            extraHideTimeout = setTimeout(function() {
                hideExtraHoverBar();
                hideExtraFrames();
            }, 80);
        });
    }

    // Works page: blue bar from right edge; Music/Design/Sports/Events use 5px left of "Design", Portraiture/Automotive use 5px left of "Automotive"
    var worksCategoryButtons = document.querySelector('.works-category-buttons');
    var worksCategoryBtns = document.querySelectorAll('.works-category-btn');
    var worksHoverBar = null;
    var worksHideTimeout = null;
    var WORKS_BAR_LEFT_INSET = 20;
    function updateWorksHoverBar(rect, hoveredBtn) {
        if (!worksHoverBar) {
            worksHoverBar = document.createElement('div');
            worksHoverBar.setAttribute('aria-hidden', 'true');
            worksHoverBar.className = 'works-hover-bar';
            worksHoverBar.style.cssText = 'position:fixed;background:#1b7ad6;z-index:0;pointer-events:none;transition:top 0.25s ease,height 0.25s ease,left 0.2s ease,right 0.2s ease,opacity 0.2s ease,background 0.2s ease;opacity:0;';
            document.body.appendChild(worksHoverBar);
        }
        if (worksHideTimeout) {
            clearTimeout(worksHideTimeout);
            worksHideTimeout = null;
        }
        var href = (hoveredBtn && hoveredBtn.getAttribute('href')) || '';
        var slug = href.replace(/^#/, '').toLowerCase();
        var isBackBtn = hoveredBtn && hoveredBtn.classList.contains('works-photo-back-btn');
        var isIndexBtn = href === '../works/index.html';
        worksHoverBar.style.background = isBackBtn ? '#d9534f' : isIndexBtn ? '#FFE957' : '#1b7ad6';
        var anchorLink = null;
        if (!isBackBtn && (slug === 'highlights' || slug === 'photography' || slug === 'illustrations')) {
            anchorLink = document.querySelector('.works-main-nav .works-category-btn[href="#photography"]');
        } else if (slug === 'portraiture') {
            anchorLink = document.querySelector('.works-photo-subnav .works-category-btn[href="#automotive"]');
        } else if (slug === 'music') {
            anchorLink = document.querySelector('.works-photo-subnav .works-category-btn.works-photo-back-btn');
        } else if (slug === 'events' || slug === 'misc') {
            anchorLink = document.querySelector('.works-photo-subnav .works-category-btn[href="#sports"]');
        }
        var leftPx = anchorLink
            ? (anchorLink.getBoundingClientRect().left - WORKS_BAR_LEFT_INSET)
            : (rect.left - WORKS_BAR_LEFT_INSET);
        worksHoverBar.style.left = Math.max(0, leftPx) + 'px';
        worksHoverBar.style.right = '0';
        worksHoverBar.style.top = rect.top + 'px';
        worksHoverBar.style.height = rect.height + 'px';
        worksHoverBar.style.opacity = '1';
    }
    function hideWorksHoverBar() {
        if (worksHoverBar) worksHoverBar.style.opacity = '0';
    }
    if (worksCategoryBtns.length) {
        worksCategoryBtns.forEach(function(btn) {
            btn.addEventListener('mouseenter', function() {
                var rect = btn.getBoundingClientRect();
                updateWorksHoverBar(rect, btn);
            });
        });
        if (worksCategoryButtons) {
            worksCategoryButtons.addEventListener('mouseleave', function() {
                worksHideTimeout = setTimeout(hideWorksHoverBar, 80);
            });
        }
        window.addEventListener('scroll', function() { hideWorksHoverBar(); }, { passive: true });
        window.addEventListener('resize', function() { hideWorksHoverBar(); });
    }

    // Works page: category panels (Music / Portraiture / Design / Automotive) — fade in on click, hide others
    var worksDesignPanel = document.getElementById('works-design-panel');
    var worksHighlightsPanel = document.getElementById('works-highlights-panel');
    var worksMusicPanel = document.getElementById('works-music-panel');
    var worksPortraiturePanel = document.getElementById('works-portraiture-panel');
    var worksAutomotivePanel = document.getElementById('works-automotive-panel');
    var worksSportsPanel = document.getElementById('works-sports-panel');
    var worksEventsPanel = document.getElementById('works-events-panel');
    var worksMiscPanel = document.getElementById('works-misc-panel');
    var worksIllustrationsPanel = document.getElementById('works-illustrations-panel');
    var worksHashToPanel = {
        highlights: worksHighlightsPanel,
        music: worksMusicPanel,
        portraiture: worksPortraiturePanel,
        design: worksDesignPanel,
        automotive: worksAutomotivePanel,
        sports: worksSportsPanel,
        events: worksEventsPanel,
        misc: worksMiscPanel,
        illustrations: worksIllustrationsPanel
    };

    function hideWorksPanels() {
        [worksDesignPanel, worksHighlightsPanel, worksMusicPanel, worksPortraiturePanel, worksAutomotivePanel, worksSportsPanel, worksEventsPanel, worksMiscPanel, worksIllustrationsPanel].forEach(function(panel) {
            if (!panel) return;
            panel.classList.remove('is-visible');
            panel.setAttribute('aria-hidden', 'true');
        });
    }

    function showWorksPanelByHash(hash) {
        var slug = (hash || '').replace(/^#/, '').toLowerCase();
        var panel = worksHashToPanel[slug] || worksHighlightsPanel || worksMusicPanel;
        hideWorksPanels();
        if (panel) {
            panel.classList.add('is-visible');
            panel.setAttribute('aria-hidden', 'false');
        }
    }

    var worksCategoryNav = document.querySelector('.works-category-buttons');
    var worksMainNav = document.querySelector('.works-main-nav');
    var worksPhotoSubnav = document.querySelector('.works-photo-subnav');

    function fadeNavSwitch(hideEl, showEl) {
        if (!hideEl || !showEl) {
            if (hideEl) hideEl.setAttribute('aria-hidden', 'true');
            if (showEl) showEl.removeAttribute('aria-hidden');
            return;
        }
        hideEl.style.opacity = '0';
        setTimeout(function() {
            hideEl.setAttribute('aria-hidden', 'true');
            hideEl.style.opacity = '';
            showEl.style.opacity = '0';
            showEl.removeAttribute('aria-hidden');
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    showEl.style.opacity = '1';
                    setTimeout(function() { showEl.style.opacity = ''; }, 220);
                });
            });
        }, 200);
    }
    function showMainNav() {
        fadeNavSwitch(worksPhotoSubnav, worksMainNav);
    }
    function showPhotoSubnav() {
        fadeNavSwitch(worksMainNav, worksPhotoSubnav);
    }

    if (worksCategoryNav) {
        worksCategoryNav.addEventListener('click', function(e) {
            var link = e.target.closest('a.works-category-btn');
            if (!link || link.getAttribute('href') === '../works/index.html') return;
            var href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;
            e.preventDefault();
            var slug = href.replace(/^#/, '').toLowerCase();
            if (slug === 'photography') {
                showPhotoSubnav();
                showWorksPanelByHash('music');
                history.pushState(null, '', window.location.pathname + '#music');
                return;
            }
            // Back button in photo sub-nav: restore main nav
            var photoSlugs = ['music', 'portraiture', 'automotive', 'sports', 'events', 'misc'];
            if (photoSlugs.indexOf(slug) === -1) {
                showMainNav();
            }
            showWorksPanelByHash(slug);
            history.pushState(null, '', window.location.pathname + '#' + slug);
        });
    }

    window.addEventListener('popstate', function() {
        var hash = window.location.hash;
        var slug = (hash || '').replace(/^#/, '').toLowerCase();
        var photoSlugs = ['music', 'portraiture', 'automotive', 'sports', 'events', 'misc'];
        if (photoSlugs.indexOf(slug) !== -1 || slug === 'photography') {
            showPhotoSubnav();
        } else {
            showMainNav();
        }
        showWorksPanelByHash(hash);
    });

    var worksIndexBtn = document.querySelector('.works-category-buttons .works-category-btn[href="../works/index.html"]');
    var worksPageWrapper = document.querySelector('.works-page-wrapper');
    if (worksIndexBtn && worksPageWrapper) {
        worksIndexBtn.addEventListener('click', function(e) {
            e.preventDefault();
            worksPageWrapper.classList.add('fade-to-index');
            document.body.classList.add('works-navigating-away');
            setTimeout(function() {
                window.location.href = '../works/index.html';
            }, 380);
        });
    }
    if (worksPageWrapper) {
        worksPageWrapper.addEventListener('click', function(e) {
            var fadeBtn = e.target.closest('.works-fade-to-asterism, .works-fade-to-page');
            if (!fadeBtn) return;
            var url = fadeBtn.getAttribute('data-fade-to');
            if (!url) return;
            e.preventDefault();
            e.stopPropagation();
            worksPageWrapper.classList.add('fade-to-asterism');
            document.body.classList.add('works-navigating-away');
            setTimeout(function() {
                window.location.href = url;
            }, 380);
        });
        worksPageWrapper.addEventListener('keydown', function(e) {
            var fadeBtn = e.target.closest('.works-fade-to-asterism, .works-fade-to-page');
            if (!fadeBtn || (e.key !== 'Enter' && e.key !== ' ')) return;
            var url = fadeBtn.getAttribute('data-fade-to');
            if (!url) return;
            e.preventDefault();
            worksPageWrapper.classList.add('fade-to-asterism');
            document.body.classList.add('works-navigating-away');
            setTimeout(function() {
                window.location.href = url;
            }, 380);
        });
    }

    // Subpages: fade out then go back to previous page in history
    var galleryBackLink = document.querySelector('a.works-category-btn[href^="../"]');
    if (galleryBackLink) {
        var openLightbox = document.getElementById('music-lightbox');
        function closeGalleryLightboxIfOpen() {
            if (!openLightbox) return;
            if (!openLightbox.classList.contains('open')) return;
            openLightbox.classList.remove('open');
            openLightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
        function navigateBack(e) {
            if (e) e.preventDefault();
            if (e) e.stopPropagation();
            closeGalleryLightboxIfOpen();
            try { sessionStorage.setItem('works-scroll-enter', '1'); } catch(err) {}
            history.back();
        }
        galleryBackLink.addEventListener('click', navigateBack);
        galleryBackLink.addEventListener('keydown', function(e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            navigateBack(e);
        });
    }


    // Works page: open with a category pre-selected from hash (e.g. works.html#music) and support back/forward
    (function() {
        var initSlug = (window.location.hash || '').replace(/^#/, '').toLowerCase();
        var photoSlugs = ['music', 'portraiture', 'automotive', 'sports', 'events', 'misc', 'photography'];
        if (photoSlugs.indexOf(initSlug) !== -1) {
            showPhotoSubnav();
        }
        showWorksPanelByHash(window.location.hash);
    })();

    // Works page: lightbox for design panel images
    var worksLightbox = document.getElementById('music-lightbox');
    if (worksLightbox) {
        var worksLightboxImg = worksLightbox.querySelector('.music-lightbox-img');
        var worksLightboxOverlay = worksLightbox.querySelector('.music-lightbox-overlay');
        var worksLightboxClose = worksLightbox.querySelector('.music-lightbox-close');
        var worksLightboxContent = worksLightbox.querySelector('.music-lightbox-content');
        if (worksLightboxImg) {
            worksLightboxImg.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        }
        document.addEventListener('click', function(e) {
            var cell = e.target.closest('.works-design-panel .music-photo, .works-highlights-panel .music-photo, .works-music-panel .music-photo, .works-portraiture-panel .music-photo, .works-automotive-panel .music-photo, .works-sports-panel .music-photo, .works-events-panel .music-photo, .asterism-gallery-wrap .music-photo, .bigfish-gallery-wrap .music-photo');
            if (!cell || !worksLightboxImg) return;
            var img = cell.querySelector('img');
            if (!img || !img.src) return;
            worksLightboxImg.src = img.src;
            worksLightboxImg.alt = img.alt || '';
            worksLightbox.setAttribute('aria-hidden', 'false');
            worksLightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        function closeWorksLightbox() {
            worksLightbox.classList.remove('open');
            worksLightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
        if (worksLightboxOverlay) worksLightboxOverlay.addEventListener('click', closeWorksLightbox);
        if (worksLightboxContent) worksLightboxContent.addEventListener('click', function(ev) {
            if (ev.target.classList.contains('music-lightbox-img')) return;
            closeWorksLightbox();
        });
        if (worksLightboxClose) worksLightboxClose.addEventListener('click', closeWorksLightbox);
        document.addEventListener('keydown', function(ev) {
            if (ev.key === 'Escape' && worksLightbox.classList.contains('open')) closeWorksLightbox();
        });
        window.addEventListener('scroll', function() {
            if (worksLightbox.classList.contains('open')) closeWorksLightbox();
        }, true);
    }

    // Custom overlay scrollbar (no gutter, no content shift) — fades in while scrolling
    (function() {
        var track = document.createElement('div');
        track.className = 'overlay-scrollbar';
        track.setAttribute('aria-hidden', 'true');
        var thumb = document.createElement('div');
        thumb.className = 'overlay-scrollbar-thumb';
        track.appendChild(thumb);
        document.body.appendChild(track);

        var scrollbarHideTimeout = null;
        var FADE_OUT_DELAY = 800;

        function showScrollbar() {
            track.classList.add('overlay-scrollbar-show');
            if (scrollbarHideTimeout) {
                clearTimeout(scrollbarHideTimeout);
                scrollbarHideTimeout = null;
            }
        }
        function scheduleHideScrollbar() {
            if (scrollbarHideTimeout) clearTimeout(scrollbarHideTimeout);
            scrollbarHideTimeout = setTimeout(function() {
                track.classList.remove('overlay-scrollbar-show');
                scrollbarHideTimeout = null;
            }, FADE_OUT_DELAY);
        }

        function getScrollMetrics() {
            var doc = document.documentElement;
            var scrollHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
            var clientHeight = doc.clientHeight;
            var scrollTop = window.scrollY || doc.scrollTop;
            return { scrollHeight: scrollHeight, clientHeight: clientHeight, scrollTop: scrollTop };
        }

        function updateThumb() {
            var m = getScrollMetrics();
            if (m.scrollHeight <= m.clientHeight) {
                track.classList.remove('overlay-scrollbar-visible');
                track.classList.remove('overlay-scrollbar-show');
                return;
            }
            track.classList.add('overlay-scrollbar-visible');
            var scrollable = m.scrollHeight - m.clientHeight;
            var thumbHeight = Math.max(40, (m.clientHeight / m.scrollHeight) * m.clientHeight / 3);
            var thumbMaxTop = m.clientHeight - thumbHeight;
            var thumbTop = scrollable > 0 ? (m.scrollTop / scrollable) * thumbMaxTop : 0;
            thumb.style.height = thumbHeight + 'px';
            thumb.style.top = thumbTop + 'px';
        }

        window.addEventListener('scroll', function() {
            updateThumb();
            if (getScrollMetrics().scrollHeight > getScrollMetrics().clientHeight) {
                showScrollbar();
                scheduleHideScrollbar();
            }
        }, { passive: true });
        window.addEventListener('resize', function() { updateThumb(); });
        updateThumb();
    })();
});

// Re-trigger page-fade-in when page is restored from browser back/forward cache
window.addEventListener('pageshow', function(e) {
    if (!e.persisted) return;
    var mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.animation = 'none';
        mainContent.offsetHeight;
        mainContent.style.animation = 'page-fade-in 0.35s ease both';
    }
    var scrollIndicator = document.querySelector('.scroll-down-indicator');
    if (scrollIndicator) {
        var enterAnim = false;
        try { enterAnim = sessionStorage.getItem('works-scroll-enter') === '1'; if (enterAnim) sessionStorage.removeItem('works-scroll-enter'); } catch(err) {}
        scrollIndicator.style.animation = 'none';
        scrollIndicator.offsetHeight;
        scrollIndicator.style.animation = enterAnim ? 'scroll-down-enter 0.55s ease both' : 'page-fade-in 0.35s ease both';
    }
    var categoryButtons = document.querySelector('.works-category-buttons');
    if (categoryButtons) {
        categoryButtons.style.animation = 'none';
        categoryButtons.offsetHeight;
        categoryButtons.style.animation = 'page-fade-in 0.35s ease both';
    }
});
