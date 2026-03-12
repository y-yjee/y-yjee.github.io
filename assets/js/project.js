document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONSTANTS
    ===================================================== */

    const MOBILE_BREAKPOINT = 768;
    const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

    const projectCards = document.querySelectorAll(".projects__card");

    /* =====================================================
       IMAGE SCROLL INTERACTION
       - Desktop: hover
       - Mobile: tap toggle
    ===================================================== */

    projectCards.forEach(card => {

        const scrollWrap = card.querySelector(".projects__media--scroll");
        if (!scrollWrap) return;

        const img = scrollWrap.querySelector(".projects__image");
        if (!img) return;

        let isScrolled = false;

        const scrollImage = () => {
            const maxScroll = img.offsetHeight - scrollWrap.offsetHeight;
            if (maxScroll > 0) {
                img.style.transform = `translateY(-${maxScroll}px)`;
            }
        };

        const resetImage = () => {
            img.style.transform = "translateY(0)";
        };

        /* Desktop hover */
        card.addEventListener("mouseenter", () => {
            if (isMobile()) return;
            scrollImage();
        });

        card.addEventListener("mouseleave", () => {
            if (isMobile()) return;
            resetImage();
            isScrolled = false;
        });

        /* Mobile tap toggle */
        card.addEventListener("click", (e) => {
            if (!isMobile()) return;
            if (e.target.closest("a")) return;

            e.preventDefault();

            isScrolled ? resetImage() : scrollImage();
            isScrolled = !isScrolled;
        });

    });

    /* =====================================================
       VIDEO INTERACTION
       - Click / Keyboard accessible
       - Only one video plays at a time
       - Auto stop using Intersection Observer
    ===================================================== */

    let activeVideo = null;
    let activeCard  = null;
    let activeWrap  = null;
    let stopReason  = null;

    const videoCards = [];

    projectCards.forEach(card => {

        const videoWrap = card.querySelector(".projects__media--video");
        if (!videoWrap) return;

        const video = videoWrap.querySelector(".projects__video");
        const icon  = videoWrap.querySelector(".projects__video-control i");

        if (!video || !icon) return;

        /* Accessibility enhancements */
        videoWrap.setAttribute("role", "button");
        videoWrap.setAttribute("tabindex", "0");
        videoWrap.setAttribute("aria-label", "Toggle video playback");

        videoCards.push({ card, videoWrap, video, icon });

        const stopVideo = (reason = "user") => {
            video.pause();
            video.currentTime = 0;

            videoWrap.classList.remove("playing");
            card.classList.remove("active");

            icon.className = "fa fa-play";

            activeVideo = null;
            activeCard  = null;
            activeWrap  = null;
            stopReason  = reason;
        };

        const playVideo = () => {

            if (activeVideo && activeVideo !== video) {
                activeVideo.pause();
                activeWrap.classList.remove("playing");
                activeCard.classList.remove("active");
                activeWrapIcon.className = "fa fa-play";
            }

            if (stopReason !== "system") {
                video.currentTime = 0;
            }

            video.play();

            videoWrap.classList.add("playing");
            card.classList.add("active");

            icon.className = "fa fa-rotate-right";

            activeVideo = video;
            activeCard  = card;
            activeWrap  = videoWrap;
            activeWrapIcon = icon;
            stopReason  = null;
        };

        /* Click interaction */
        videoWrap.addEventListener("click", (e) => {
            e.preventDefault();
            video.paused ? playVideo() : stopVideo("user");
        });

        /* Keyboard interaction */
        videoWrap.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                video.paused ? playVideo() : stopVideo("user");
            }
        });

        /* When video ends */
        video.addEventListener("ended", () => {
            stopVideo("user");
        });

    });

    /* =====================================================
       AUTO STOP USING INTERSECTION OBSERVER
       - Stops video when card leaves viewport
    ===================================================== */

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {

                const videoObj = videoCards.find(v => v.card === entry.target);
                if (!videoObj) return;

                if (videoObj.video === activeVideo) {

                    videoObj.video.pause();
                    videoObj.videoWrap.classList.remove("playing");
                    videoObj.card.classList.remove("active");
                    videoObj.icon.className = "fa fa-play";

                    activeVideo = null;
                    activeCard  = null;
                    activeWrap  = null;
                    stopReason  = "system";
                }
            }
        });

    }, {
        threshold: 0.2
    });

    videoCards.forEach(v => observer.observe(v.card));

});