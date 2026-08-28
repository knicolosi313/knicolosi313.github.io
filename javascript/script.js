// Mark that JS is available so reveal animations only hide content when they can un-hide it.
document.documentElement.classList.add('js');

(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Reveal on scroll ──────────────────────────
       Above-the-fold content animates in on load without
       needing IntersectionObserver. Everything below waits
       for scroll — but if IO never reports back (suspended
       rendering, prerender, an unsupported engine) a
       failsafe reveals it, so the page is never left blank. */

    var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    function show(el, delay) {
        setTimeout(function () { el.classList.add('visible'); }, delay || 0);
    }

    function inViewport(el) {
        var r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
    }

    var initial = revealables.filter(inViewport);
    var deferred = revealables.filter(function (el) { return initial.indexOf(el) === -1; });

    initial.forEach(function (el, i) { show(el, Math.min(i, 6) * 90); });

    if (deferred.length) {
        if (!('IntersectionObserver' in window)) {
            deferred.forEach(function (el) { el.classList.add('visible'); });
        } else {
            var reported = false;

            var revealObserver = new IntersectionObserver(function (entries) {
                reported = true;
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var group = entry.target.parentElement.querySelectorAll(':scope > .reveal');
                    var i = Array.prototype.indexOf.call(group, entry.target);
                    show(entry.target, Math.min(i, 5) * 80);
                    revealObserver.unobserve(entry.target);
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

            deferred.forEach(function (el) { revealObserver.observe(el); });

            // A healthy observer reports on every observed element almost
            // immediately. Silence means it isn't running — show the content.
            setTimeout(function () {
                if (reported) return;
                revealObserver.disconnect();
                deferred.forEach(function (el) { el.classList.add('visible'); });
            }, 1500);
        }
    }

    /* ── Nav: scrolled state + section highlighting ── */

    var nav = document.getElementById('nav');
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));

    var sections = navLinks.map(function (link) {
        return { link: link, el: document.querySelector(link.getAttribute('href')) };
    }).filter(function (s) { return s.el; });

    var ticking = false;

    function onScrollFrame() {
        ticking = false;

        if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);

        if (!sections.length) return;

        var line = window.innerHeight * 0.3;
        var active = null;

        sections.forEach(function (s) {
            if (s.el.getBoundingClientRect().top <= line) active = s.link;
        });

        var atBottom = window.innerHeight + window.scrollY >=
                       document.documentElement.scrollHeight - 2;
        if (atBottom) active = sections[sections.length - 1].link;

        navLinks.forEach(function (l) { l.classList.toggle('active', l === active); });
    }

    function requestFrame() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(onScrollFrame);
    }

    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', requestFrame);
    onScrollFrame();

    /* ── Mobile nav toggle ────────────────────────── */

    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-links');

    function closeMenu() {
        if (!menu || !toggle) return;
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var open = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', function (e) {
            if (!menu.classList.contains('open')) return;
            if (menu.contains(e.target) || toggle.contains(e.target)) return;
            closeMenu();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 860) closeMenu();
        });
    }

    /* ── Cursor-tracked aurora glow ────────────────
       Pointer-driven only; skipped for touch input and
       when the visitor prefers reduced motion. */

    var glow = document.getElementById('pointer-glow');

    if (glow && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
        var gx = 0, gy = 0, glowQueued = false;

        var paintGlow = function () {
            glowQueued = false;
            glow.style.transform = 'translate3d(' + (gx - 260) + 'px,' + (gy - 260) + 'px, 0)';
        };

        window.addEventListener('pointermove', function (e) {
            gx = e.clientX;
            gy = e.clientY;
            if (!glow.classList.contains('on')) glow.classList.add('on');
            if (glowQueued) return;
            glowQueued = true;
            window.requestAnimationFrame(paintGlow);
        }, { passive: true });

        document.addEventListener('pointerleave', function () {
            glow.classList.remove('on');
        });
    }
})();
