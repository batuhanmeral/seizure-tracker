(function () {
    var STORAGE_KEY = 'epitrack-theme';

    // Lucide sun/moon ikonları; renk butonun color değerinden gelir
    var SVG_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" '
        + 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
    var ICON_SUN = SVG_OPEN + '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/>'
        + '<path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/>'
        + '<path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    var ICON_MOON = SVG_OPEN + '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

    function getPreferred() {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') {
            return saved;
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Sayfa boyanmadan önce temayı uygula (flaş önleme)
    apply(getPreferred());

    function setupToggle() {
        var current = document.documentElement.getAttribute('data-theme') || 'light';

        var btn = document.createElement('button');
        btn.className = 'theme-toggle';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Temayı değiştir');
        btn.title = 'Açık / Koyu tema';
        btn.innerHTML = current === 'dark' ? ICON_SUN : ICON_MOON;

        btn.addEventListener('click', function () {
            var next = (document.documentElement.getAttribute('data-theme') === 'dark')
                ? 'light'
                : 'dark';
            apply(next);
            localStorage.setItem(STORAGE_KEY, next);
            btn.innerHTML = next === 'dark' ? ICON_SUN : ICON_MOON;
        });

        // Tema butonunu üst çubuğa yerleştir
        var nav = document.querySelector('.nav-actions');
        if (nav) {
            var primaryAction = nav.querySelector('.nav-primary-action');
            var userMenu = nav.querySelector('.user-menu');
            if (primaryAction) {
                nav.insertBefore(btn, primaryAction);
            } else if (userMenu) {
                nav.insertBefore(btn, userMenu);
            } else {
                nav.appendChild(btn);
            }
        } else {
            var row = document.querySelector('.header .container > div');
            (row || document.body).appendChild(btn);
        }
    }

    function closeAllMenus() {
        var open = document.querySelectorAll('.user-menu.open');
        for (var i = 0; i < open.length; i++) {
            open[i].classList.remove('open');
        }
    }

    function setupMenus() {
        var toggles = document.querySelectorAll('[data-dropdown-toggle]');
        for (var i = 0; i < toggles.length; i++) {
            (function (toggle) {
                var menu = toggle.closest('.user-menu');
                if (!menu) return;
                toggle.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var isOpen = menu.classList.contains('open');
                    closeAllMenus();
                    if (!isOpen) {
                        menu.classList.add('open');
                    }
                    toggle.setAttribute('aria-expanded', String(!isOpen));
                });
            })(toggles[i]);
        }

        document.addEventListener('click', closeAllMenus);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeAllMenus();
            }
        });
    }

    function init() {
        setupToggle();
        setupMenus();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
