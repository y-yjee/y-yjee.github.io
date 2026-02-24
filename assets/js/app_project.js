/* ======================================================
   Projects Reveal Animation (PC / Mobile 공통)
   ------------------------------------------------------
   ▪ Projects 섹션 진입 시
   ▪ 섹션 헤더 → 프로젝트 카드 순서대로 등장
   ▪ PC / Mobile 동일한 연출
   ▪ IntersectionObserver 기반 (한 번만 실행)
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {

    /* ----------------------------------------------
       1. Projects 섹션 찾기
       ---------------------------------------------- */
    const projects = document.querySelector('#projects');
    if (!projects) return; // Projects 섹션이 없으면 실행 안 함

    /* ----------------------------------------------
       2. Reveal 대상 요소들
       - 섹션 헤더
       - 프로젝트 카드들
       ---------------------------------------------- */
    const revealTargets = projects.querySelectorAll(
        '.section_head, .project_card'
    );
    if (!revealTargets.length) return;

    /* ----------------------------------------------
       3. 딜레이 타이밍 설정 (디자인 감각 포인트 🎨)
       ---------------------------------------------- */
    const HEADER_DELAY = 0.2;        // 헤더 등장 지연
    const CARD_START_DELAY = 0.35;   // 첫 카드 시작 시점
    const CARD_GAP = 0.15;           // 카드 간 간격

    /* ----------------------------------------------
       4. IntersectionObserver 생성
       ---------------------------------------------- */
    const observer = new IntersectionObserver((entries, obs) => {

        entries.forEach(entry => {

            // 화면에 들어오지 않으면 무시
            if (!entry.isIntersecting) return;

            const el = entry.target;

            /* --------------------------------------
               4-1. 섹션 헤더 Reveal
               -------------------------------------- */
            if (el.classList.contains('section_head')) {
                // 헤더는 가장 먼저, 단독 딜레이
                el.style.transitionDelay = `${HEADER_DELAY}s`;
            }

            /* --------------------------------------
               4-2. 프로젝트 카드 Reveal (stagger)
               -------------------------------------- */
            if (el.classList.contains('project_card')) {

                // Projects 섹션 내 카드 목록
                const cards = [
                    ...projects.querySelectorAll('.project_card')
                ];

                // 현재 카드의 순서
                const index = cards.indexOf(el);

                // 카드별 딜레이 계산
                el.style.transitionDelay =
                    `${CARD_START_DELAY + index * CARD_GAP}s`;
            }

            /* --------------------------------------
               4-3. Reveal 실행
               -------------------------------------- */
            el.classList.remove('hidden'); // 숨김 해제
            el.classList.add('show');      // 애니메이션 시작

            // 한 번 등장한 요소는 더 이상 감시하지 않음
            obs.unobserve(el);
        });

    }, {
        threshold: 0.2 // 섹션이 화면에 들어오는 시점
    });

    /* ----------------------------------------------
       5. 모든 Reveal 대상 감시 시작
       ---------------------------------------------- */
    revealTargets.forEach(el => observer.observe(el));

});

/* ======================================================
   Project Image Scroll Toggle (PC · Mobile 공통)
   ------------------------------------------------------
   ▪ 이미지가 카드 영역보다 클 경우에만 동작
   ▪ PC  : hover 시 이미지 아래로 스크롤 / 해제 시 복귀
   ▪ Mobile : tap(클릭) 시 스크롤 토글
   ▪ 스크롤 거리는 실제 이미지 높이 기준으로 계산
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {

    // 모든 프로젝트 카드 선택
    const projectCards = document.querySelectorAll('.project_card');

    projectCards.forEach(card => {

        // 이미지 감싸는 영역 (.project_img)
        const imgWrap = card.querySelector('.project_img');
        // 실제 스크롤될 이미지
        const img = imgWrap?.querySelector('img');

        // 요소가 없으면 중단
        if (!imgWrap || !img) return;

        // 현재 스크롤 상태 저장 (모바일 토글용)
        let isScrolled = false;

        /* --------------------------------------------------
           이미지 스크롤 적용 함수
           ▪ 이미지 높이 - 컨테이너 높이 만큼 이동
        -------------------------------------------------- */
        const scrollImage = () => {
            const imgHeight = img.offsetHeight;      // 전체 이미지 높이
            const wrapHeight = imgWrap.offsetHeight; // 보이는 영역 높이
            const maxScroll = imgHeight - wrapHeight;

            // 이미지가 더 클 때만 스크롤
            if (maxScroll > 0) {
                img.style.transform = `translateY(-${maxScroll}px)`;
            }
        };

        /* --------------------------------------------------
           이미지 원위치 복귀 함수
        -------------------------------------------------- */
        const resetImage = () => {
            img.style.transform = 'translateY(0)';
        };

        /* ===============================
           PC : hover 기반 동작
        =============================== */
        card.addEventListener('mouseenter', () => {
            scrollImage();
        });

        card.addEventListener('mouseleave', () => {
            resetImage();
            isScrolled = false; // 상태 초기화
        });

        /* ===============================
           Mobile : tap(클릭) 토글
        =============================== */
        card.addEventListener('click', (e) => {

            // 모바일에서만 토글 동작
            if (!window.matchMedia("(max-width: 768px)").matches) return;

            e.preventDefault();

            if (!isScrolled) {
                scrollImage();
                isScrolled = true;
            } else {
                resetImage();
                isScrolled = false;
            }
        });
    });
});

/* ======================================================
   프로젝트 비디오 인터랙션 스크립트
   ------------------------------------------------------
   ▪ 카드 클릭 시
     - ▶ 상태 → 재생
     - ↻ 상태 → 처음부터 재생

   ▪ UI 처리
     - hover 시 ▶ 아이콘 표시 (CSS)
     - 재생 중엔 아이콘 자연스럽게 숨김
     - 영상 종료 시 ▶ 아이콘으로 자동 복귀

   ▪ 자동 정지
     - 다른 프로젝트 클릭 시 기존 영상 정지
     - 스크롤 시 영상 정지

   ▪ 카드 상태 처리
     - 영상 재생 중 → .project_card.active 유지
     - 영상 정지 / 종료 / 시스템 정지 → active 제거

   // stopReason 설명
   // user   : 사용자가 직접 클릭해서 멈춤 (다시 누르면 처음부터)
   // system : 스크롤 / 다른 카드로 인해 멈춤 (다시 누르면 이어서)  
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {

    const projectCards = document.querySelectorAll('.project_card');

    // 현재 재생 중인 영상 기억
    let activeVideo = null;
    let activeWrap = null;
    let activeCard  = null;

    let stopReason = null;
    // 'user' | 'system' | null

    projectCards.forEach(card => {

        const videoWrap = card.querySelector('.project_img.video');
        if (!videoWrap) return;

        const video = videoWrap.querySelector('video');
        const icon = videoWrap.querySelector('.video_control i');

        if (!video || !icon) return;

        /* ===============================
           카드 클릭 시 재생 / 일시정지
        =============================== */
        card.addEventListener('click', (e) => {

            // ⭐ 링크 버튼 클릭이면 아무것도 하지 않음
            if (e.target.closest('a')) return;
            
            e.preventDefault();

            /* 다른 카드에서 재생 중인 영상이 있으면 정지 */
            if (activeVideo && activeVideo !== video) {
                activeVideo.pause();

                activeWrap.classList.remove('playing');
                activeCard.classList.remove('active');

                activeWrap.querySelector('.video_control i')
                          .className = 'fa fa-play';

                stopReason = 'system';
                activeVideo = null;
                activeWrap = null;
                activeCard  = null;
            }

            /* ▶ 클릭 시(재생 상태) */
            if (video.paused) {

                if (stopReason === 'system') {
                    // 👉 시스템 정지 → 이어서 재생
                    video.play();
                } else {
                    // 👉 사용자 클릭 / 처음 클릭 → 처음부터 재생
                    video.currentTime = 0;
                    video.play();
                }

                videoWrap.classList.add('playing');
                card.classList.add('active');   // ⭐ 카드 active 유지
                icon.className = 'fa fa-rotate-right';

                activeVideo = video;
                activeWrap = videoWrap;
                activeCard  = card;
                stopReason = null;
            }
            else {
                // 👉 사용자가 클릭해서 멈춘 경우
                video.pause();
                video.currentTime = 0;

                videoWrap.classList.remove('playing');
                 card.classList.remove('active'); // ⭐ active 제거
                icon.className = 'fa fa-play';

                stopReason = 'user';
                activeVideo = null;
                activeWrap = null;
                activeCard  = null;
            }
        });

        /* ===============================
           영상 재생 종료 시 처리
        =============================== */
        video.addEventListener('ended', () => {
            videoWrap.classList.remove('playing');
            card.classList.remove('active'); // ⭐ 재생 종료 → active 제거
            icon.className = 'fa fa-play';

            stopReason = 'user'; // 끝까지 재생 완료
            activeVideo = null;
            activeWrap = null;
            activeCard  = null;
        });
    });

    /* ===============================
       스크롤 시 영상 자동 정지
    =============================== */
    window.addEventListener('scroll', () => {
        if (!activeVideo) return;

        activeVideo.pause();

        activeWrap.classList.remove('playing');
        activeCard.classList.remove('active'); // ⭐ 시스템 정지 → active 제거

        activeWrap.querySelector('.video_control i')
                  .className = 'fa fa-play';

        stopReason = 'system'; // ⭐ 핵심
        activeVideo = null;
        activeWrap = null;
        activeCard  = null;
    });

});