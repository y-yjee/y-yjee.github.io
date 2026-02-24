/* 헤더 효과 */  
document.addEventListener("DOMContentLoaded", () => {  
    const header = document.querySelector('header.sticky');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // 스크롤 내리고, 50px 이상 내려왔으면 -> 숨김
        header.classList.add('hide');
    } else {
        // 스크롤 올리면 -> 보이기
        header.classList.remove('hide');
    }

    lastScrollY = currentScrollY;
    ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
});

/* GNB메뉴 클릭 시 부드럽게 이동 */
document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll('.gnb a'); // GNB 메뉴 링크 선택

    menuLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();

            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            // margin-top: 200px 적용
            const offset = 200; // 원하는 offset
            const targetPosition = targetElement.offsetTop - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
});

/* GNB Ripple Effect (Mobile Only) */
document.addEventListener("DOMContentLoaded", () => {

    // 모바일 환경인지 판별
    const isMobile =
        window.matchMedia("(max-width: 768px)").matches &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // 모바일이 아니면 ripple 효과 적용 안 함    
    if (!isMobile) return;

    const links = document.querySelectorAll('.gnb a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {

            // 기존 ripple 제거(빠르게 연속 클릭 시 중복 생성 방지)
            const oldRipple = this.querySelector('.ripple');
            if (oldRipple) oldRipple.remove();

            // ripple 요소 생성(실제로 화면에 그려질 동그란 물결)
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // 클릭한 버튼의 크기와 위치 정보 가져오기
            const rect = this.getBoundingClientRect();

            // ripple 크기 계산
            // 버튼을 완전히 덮을 수 있도록 width와 height 중 더 큰 값 사용
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;

            // 클릭한 위치 기준으로 ripple 위치 계산
            // e.clientX / clientY : 화면 기준 클릭 좌표
            // rect.left / top : 버튼의 위치
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

            // 버튼 안에 ripple 추가(CSS 애니메이션이 자동 실행)
            this.appendChild(ripple);

            //애니메이션 종료 후 ripple 제거 DOM 정리 (메모리 & 성능 관리)
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

/* ======================================================
   Common Reveal (Skills / About / Contact)
   ------------------------------------------------------
   ▪ Skills 카드
     - PC : 즉시 표시 (reveal 없음)
     - Mobile : 스르륵 reveal
   ▪ About / Contact 카드
     - PC / Mobile 공통 reveal
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {

    // 모바일 여부 판별
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // reveal 대상 전체 선택
    const revealItems = document.querySelectorAll('.reveal');
    if (!revealItems.length) return;

    /* --------------------------------------------------
       초기 상태 세팅 (🔥 이 부분이 핵심)
       -------------------------------------------------- */
    revealItems.forEach(el => {

        // Skills 카드 처리
        if (el.classList.contains('skills_card')) {

            if (isMobile) {
                // 📱 모바일 → 숨김 후 reveal
                el.classList.add('hidden');
            } else {
                // 🖥 PC → 바로 보여줌
                el.classList.remove('hidden');
            }
            return;
        }

        // About / Contact
        // PC / Mobile 공통으로 reveal
        el.classList.add('hidden');
    });

    /* --------------------------------------------------
       IntersectionObserver
       -------------------------------------------------- */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {

            if (!entry.isIntersecting) return;

            const el = entry.target;

            // 🖥 PC + Skills 카드는 reveal 안 함
            if (el.classList.contains('skills_card') && !isMobile) {
                obs.unobserve(el);
                return;
            }

            // 🎨 딜레이 연출
            el.style.transitionDelay = `${index * 0.08}s`;

            el.classList.remove('hidden');
            el.classList.add('show');

            obs.unobserve(el);
        });
    }, {
        threshold: 0.15
    });

    // Observer 등록
    revealItems.forEach(el => observer.observe(el));
});