document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. Environment Detection
    ========================= */

    const isMobileWidth = window.matchMedia("(max-width: 768px)").matches;
    const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;

    /* =========================
       2. Typing Animation 
    ========================= */

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const line1 = document.querySelector(".home__typing-line:first-child");
    const line2 = document.querySelector(".home__typing-line:last-child");

    if (!line1 || !line2) return;

    /* =========================
       PC
    ========================= */
    if (!isMobile) {

        const lines = [line1, line2];
        const texts = lines.map(el => el.textContent.trim());

        const typingSpeed = 90;
        const pauseTime = 1500;

        function startTyping() {

            let lineIdx = 0;
            let charIdx = 0;

            lines.forEach(el => {
                el.textContent = "";
            });

            function type() {

                const el = lines[lineIdx];
                const text = texts[lineIdx];

                if (charIdx < text.length) {

                    el.textContent += text[charIdx++];
                    setTimeout(type, typingSpeed);

                } else if (++lineIdx < lines.length) {

                    charIdx = 0;
                    setTimeout(type, 500); 

                } else {

                    setTimeout(startTyping, pauseTime);
                }
            }

            type();
        }

        startTyping();
    }

    /* =========================
       Mobile
    ========================= */
    else {

        const targets = [
            {
                el: line1,
                lines: ["작은 디테일 하나도", "놓치지 않습니다."]
            },
            {
                el: line2,
                lines: ["사용자 경험과 안정성을", "함께 고민하는 개발자"]
            }
        ];

        const typingSpeed = 90;
        const lineDelay = 400;
        const restartDelay = 1500;

        function startTyping() {

            let targetIndex = 0;
            let lineIndex = 0;
            let charIndex = 0;

            targets.forEach(t => t.el.innerHTML = "");

            function type() {

                const target = targets[targetIndex];
                const currentLine = target.lines[lineIndex];

                if (charIndex < currentLine.length) {

                    target.el.innerHTML += currentLine.charAt(charIndex);
                    charIndex++;
                    setTimeout(type, typingSpeed);

                } else {

                    if (lineIndex === 0) {
                        target.el.innerHTML += "<br>";
                    }

                    lineIndex++;
                    charIndex = 0;

                    if (lineIndex < target.lines.length) {

                        setTimeout(type, lineDelay);

                    } else {

                        targetIndex++;
                        lineIndex = 0;

                        if (targetIndex < targets.length) {
                            setTimeout(type, lineDelay);
                        } else {
                            setTimeout(startTyping, restartDelay);
                        }
                    }
                }
            }

            type();
        }

        startTyping();
    }

    /* =========================
       3. Keyword Interaction
    ========================= */

    const keywordButtons = document.querySelectorAll(".home__keywords-button");
    const descBox = document.querySelector(".home__keywords-desc");

    if (keywordButtons.length && descBox) {

        keywordButtons.forEach(button => {

            button.addEventListener("click", (e) => {

                const isActive = button.classList.contains("home__keywords-button--active");

                // 초기화
                keywordButtons.forEach(btn =>
                    btn.classList.remove("home__keywords-button--active")
                );

                if (isActive) {
                    descBox.textContent = "";
                    descBox.classList.remove("home__keywords-desc--show");
                    return;
                }

                button.classList.add("home__keywords-button--active");
                descBox.textContent = button.dataset.desc;
                descBox.classList.add("home__keywords-desc--show");


                /* Ripple (Touch Device Only) */
                if (!isTouchDevice) return;

                createRipple(e, button, "home-keyword-ripple");
            });
        });
    }

    /* =========================
       4. Skills Tabs
    ========================= */

    const tabs = document.querySelectorAll(".home__skills-tab");
    const panels = document.querySelectorAll(".home__skills-panel");

    if (tabs.length && panels.length) {

        tabs.forEach(tab => {

            tab.addEventListener("click", (e) => {

                e.preventDefault();
                const target = tab.dataset.tab;

                // 버튼 활성화
                tabs.forEach(t =>
                    t.classList.remove("home__skills-tab--active")
                );
                tab.classList.add("home__skills-tab--active");

                // 패널 전환
                panels.forEach(panel => {
                    panel.classList.toggle(
                        "home__skills-panel--active",
                        panel.dataset.panel === target
                    );
                });

                // Ripple (Touch Only)
                if (isTouchDevice) {
                    createRipple(e, tab, "home-skills-ripple");
                }
            });
        });
    }

    /* =========================
       5. Ripple Utility Function
    ========================= */

    function createRipple(event, element) {

        const oldRipple = element.querySelector(".ripple");
        if (oldRipple) oldRipple.remove();

        const ripple = document.createElement("span");
        ripple.classList.add("ripple");

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

});