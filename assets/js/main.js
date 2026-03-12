document.addEventListener("DOMContentLoaded", () => {

    const header = document.querySelector(".header");
    const navLinks = document.querySelectorAll(".gnb__link");
    const sections = document.querySelectorAll("section");
    const revealItems = document.querySelectorAll(".reveal");

    let lastScrollY = window.scrollY;
    let ticking = false;

    const MOBILE_BREAKPOINT = 768;

    /* ======================================================
       1. Header Behavior (Shrink PC / Hide Mobile)
    ====================================================== */

    function updateHeader(scrollY) {

        const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const isBottom = scrollY + windowHeight >= documentHeight - 5;

        /* PC - Shrink */
        if (!isMobile && scrollY > 80) {
            header.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
        }

        /* Mobile - Hide on Scroll Down */
        if (isMobile) {
            if (scrollY > lastScrollY && scrollY > 80 && !isBottom) {
                header.classList.add("hide");
            } else {
                header.classList.remove("hide");
            }
        } else {
            header.classList.remove("hide");
        }

        lastScrollY = scrollY;
    }

    /* ======================================================
       2️. Active Menu Highlight
    ====================================================== */

    function updateActiveMenu(scrollY) {

        let currentSection = "";
        const headerHeight = header.offsetHeight;

        if (scrollY < 50 && sections.length) {
            currentSection = sections[0].id;
        } else {

            sections.forEach(section => {

                const sectionTop =
                    section.offsetTop - headerHeight - 20;

                if (scrollY >= sectionTop) {
                    currentSection = section.id;
                }
            });

            /* Bottom Fix */
            if (
                window.innerHeight + scrollY >=
                document.documentElement.scrollHeight - 5
            ) {
                currentSection = sections[sections.length - 1].id;
            }
        }

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${currentSection}`
            );
        });
    }

    /* ======================================================
       3️. Unified Scroll Handler (Performance Optimized)
    ====================================================== */

    function onScroll() {
        const scrollY = window.scrollY;

        updateHeader(scrollY);
        updateActiveMenu(scrollY);

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    });

    /* ======================================================
       4️. Smooth Scroll (Header Height Auto Offset)
    ====================================================== */

    function initSmoothScroll() {

        navLinks.forEach(link => {

            link.addEventListener("click", e => {

                const href = link.getAttribute("href");
                if (!href || href === "#") return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const headerHeight = header.offsetHeight;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            });
        });
    }

    /* ======================================================
        5. GLOBAL REVEAL SYSTEM 
    ====================================================== */

    function initRevealSystem() {

        /* CONFIGURATION (Centralized animation settings) */
        const CONFIG = {
            HERO_DELAY: 500,
            PROJECT_HEADER_DELAY: 150,
            PROJECT_CARD_STAGGER: 500,
            OBSERVER_THRESHOLD: 0.25,
            OBSERVER_ROOT_MARGIN: "0px 0px -5% 0px"
        };

        /* CACHE DOM (No repeated querySelectorAll) */
        const revealElements = document.querySelectorAll(".reveal");
        if (!revealElements.length) return;

        const heroSections = document.querySelectorAll(
            '[data-reveal="hero-section"]'
        );

        const projectCards = document.querySelectorAll(
            '[data-reveal="project-card"]'
        );

        const projectHeader = document.querySelectorAll(
            '[data-reveal="project-header"]'
        );

        /* ======================================================
            5-1. HERO Sequential Animation (First View Only)
        ====================================================== */

        heroSections.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add("show");
            }, index * CONFIG.HERO_DELAY);
        });

        /* ======================================================
            5-2. INTERSECTION OBSERVER
        ====================================================== */

        const observer = new IntersectionObserver((entries, obs) => {

            // Filter only entering elements
            const visibleEntries = entries.filter(entry => entry.isIntersecting);

            if (!visibleEntries.length) return;

            /* Handle Project Card Stagger by GROUP */
            const visibleProjectCards = visibleEntries.filter(entry =>
                entry.target.dataset.reveal === "project-card"
            );

            visibleProjectCards.forEach((entry, groupIndex) => {
                const el = entry.target;
                el.style.transitionDelay = `${groupIndex * CONFIG.PROJECT_CARD_STAGGER}ms`;
            });

            /* Handle Other Reveal Types */
            visibleEntries.forEach(entry => {

                const el = entry.target;
                const type = el.dataset.reveal;

                if (type === "hero-section") {
                    obs.unobserve(el);
                    return;
                }

                if (type === "project-header") {
                    el.style.transitionDelay = `${CONFIG.PROJECT_HEADER_DELAY}ms`;
                }

                if (type !== "project-card" && type !== "project-header") {
                    el.style.transitionDelay = "0ms";
                }

                el.classList.add("show");
                obs.unobserve(el);

            });

        }, {
            threshold: CONFIG.OBSERVER_THRESHOLD,
            rootMargin: CONFIG.OBSERVER_ROOT_MARGIN
        });

        revealElements.forEach(el => observer.observe(el));
    }

    initRevealSystem();

    /* ======================================================
       6️. Mobile Ripple Effect (Touch Only)
    ====================================================== */

    function initMobileRipple() {

        const isTouch =
            ("ontouchstart" in window || navigator.maxTouchPoints > 0);

        const isMobile =
            window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

        if (!isTouch || !isMobile) return;

        navLinks.forEach(link => {

            link.addEventListener("click", function (e) {

                const oldRipple = this.querySelector(".ripple");
                if (oldRipple) oldRipple.remove();

                const ripple = document.createElement("span");
                ripple.classList.add("ripple");

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);

                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left =
                    `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top =
                    `${e.clientY - rect.top - size / 2}px`;

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    /* ======================================================
       7. Scroll Progress Indicator & Back To Top Control
    ====================================================== */

    function initScrollProgressButton() {

        const button = document.querySelector(".scroll-progress");
        const circle = document.querySelector(".progress-ring__circle");

        if (!button || !circle) return;

        const radius = 24;
        const circumference = 2 * Math.PI * radius;
        const SHOW_OFFSET = 400;

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        function updateProgress() {

            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollTop / docHeight;
            const offset = circumference - progress * circumference;

            circle.style.strokeDashoffset = offset;

            if (scrollTop > SHOW_OFFSET) {
                button.classList.add("show");
            } else {
                button.classList.remove("show");
            }

            if (progress >= 0.99) {
                circle.classList.add("complete");
            } else {
                circle.classList.remove("complete");
            }
        }

        window.addEventListener("scroll", updateProgress);

        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

    }

    initScrollProgressButton();

    /* ======================================================
       Initialize
    ====================================================== */

    function init() {
        initSmoothScroll();
        initRevealSystem();
        initMobileRipple();
        updateActiveMenu(window.scrollY);
        initScrollProgressButton(); 
    }

    init();
});