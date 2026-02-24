/* 타이핑 애니메이션 스크립트 (PC) */
document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const lines = [
        document.querySelector(".line1"),
        document.querySelector(".line2")
    ];

    // ⭐ HTML에 있는 텍스트를 원본으로 사용
    const texts = lines.map(el => el.textContent);

    const typingSpeed = 90;
    const pauseTime = 1500;

    function startTyping() {
        let lineIdx = 0;
        let charIdx = 0;

        // 초기화 (모바일에서 남은 <br> 제거)
        lines.forEach(el => {
            el.innerHTML = "";
            el.style.visibility = "visible";
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
});

/* 타이핑 애니메이션 스크립트 (Mobile) */
document.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const targets = [
        {
            el: document.querySelector(".line1"),
            lines: ["작은 디테일 하나도", "놓치지 않습니다."]
        },
        {
            el: document.querySelector(".line2"),
            lines: ["사용자 경험과 안정성을", "함께 고민하는 개발자"]
        }
    ];

    const typingSpeed = 90;
    const lineDelay = 400;
    const restartDelay = 1500;

    if (!isMobile) return; // 🔒 모바일에서만 실행

    function startTyping() {
        let targetIndex = 0;
        let lineIndex = 0;
        let charIndex = 0;

        // 초기화
        targets.forEach(t => t.el.innerHTML = "");

        function type() {
            const target = targets[targetIndex];
            const currentLine = target.lines[lineIndex];

            if (charIndex < currentLine.length) {
                target.el.innerHTML += currentLine.charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                // 한 줄 끝
                if (lineIndex === 0) {
                    target.el.innerHTML += "<br>";
                }

                lineIndex++;
                charIndex = 0;

                if (lineIndex < target.lines.length) {
                    setTimeout(type, lineDelay);
                } else {
                    // 다음 요소로
                    targetIndex++;
                    lineIndex = 0;

                    if (targetIndex < targets.length) {
                        setTimeout(type, lineDelay);
                    } else {
                        // 전체 반복
                        setTimeout(startTyping, restartDelay);
                    }
                }
            }
        }

        type();
    }

    startTyping();
});

/* 키워드 효과 */
document.addEventListener("DOMContentLoaded", () => {

    const keywordItems = document.querySelectorAll(".keyword_list li");
    const descBox = document.querySelector(".keyword_desc");

    // 모바일 환경 판별 (ripple 전용)
    const isMobile =
        window.matchMedia("(max-width: 768px)").matches &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    keywordItems.forEach(item => {
        item.addEventListener("click", function (e) {

            const isActive = this.classList.contains("active");

            // 모든 키워드 초기화
            keywordItems.forEach(i => i.classList.remove("active"));

            // 같은 키워드를 다시 클릭한 경우 → 닫기
            if (isActive) {
                descBox.textContent = "";
                descBox.classList.remove("show");
                return;
            }

            // 새로운 키워드 선택
            this.classList.add("active");
            descBox.textContent = this.dataset.desc;
            descBox.classList.add("show");

            /* =========================
               Ripple (Mobile Only)
            ========================= */
            if (!isMobile) return;

            const oldRipple = this.querySelector(".ripple");
            if (oldRipple) oldRipple.remove();

            const ripple = document.createElement("span");
            ripple.classList.add("ripple");

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

/* 스킬탭 - 콘텐츠 전환 */
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".skills_tabs button");
    const panels = document.querySelectorAll(".skills_panel");

    // 모바일/PC 공통 Ripple 적용 가능 여부 확인
    const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    tabs.forEach(tab => {

        tab.addEventListener("click", (e) => {
            e.preventDefault();

            const target = tab.dataset.tab;

            // 1️⃣ 버튼 활성화
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // 2️⃣ 패널 전환
            panels.forEach(panel => {
                if (panel.dataset.panel === target) {
                    panel.classList.add("active");
                } else {
                    panel.classList.remove("active");
                }
            });

            // 3️⃣ Ripple 효과 (모바일/터치 전용)
            if (isTouchDevice) {
                // 기존 ripple 제거
                const oldRipple = tab.querySelector(".ripple");
                if (oldRipple) oldRipple.remove();

                // ripple 생성
                const ripple = document.createElement("span");
                ripple.classList.add("ripple");

                const rect = tab.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

                tab.appendChild(ripple);

                // 애니메이션 종료 후 제거
                setTimeout(() => ripple.remove(), 600);
            }
        });

    });
});