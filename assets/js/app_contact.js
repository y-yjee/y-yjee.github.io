/* ======================================================
   Contact Flip Interaction Script
   ------------------------------------------------------
   ▪ 앞면 클릭 → 카드 뒤집힘 (active)
   ▪ X 버튼 클릭 → 카드 닫힘
   ▪ GitHub 카드
     - flip 동작 동일
     - 'GitHub로 이동' 클릭 시 새 탭 이동

   ▪ 상태 제어
     - 한 번에 하나의 카드만 active 유지
     - 다른 카드 선택 시 기존 active 자동 해제

   ▪ UX 의도
     - 클릭 의도가 명확한 인터랙션
     - mobile / PC 공통 동작
     - 의도치 않은 토글 방지

   ▪ 적용 대상
     - .contact_item
====================================================== */
document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       Contact 카드 전체 선택
    =============================== */
    const contactItems = document.querySelectorAll('.contact_item');

    contactItems.forEach(item => {

        const front = item.querySelector('.contact_front');
        const closeBtn = item.querySelector('.contact_close');
        const linkBtn = item.querySelector('.contact_link');

        /* ===============================
           앞면 클릭  → 뒤집기
        =============================== */
        front.addEventListener('click', (e) => {
            e.stopPropagation();

            /* 다른 카드 active 해제 */
            contactItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });

            /* 현재 카드 활성화 */
            item.classList.add('active');
        });

        /* ===============================
           X 버튼 클릭 → 닫기
        =============================== */
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.remove('active');
            });
        }

         /* ===============================
           GitHub 링크 이동
        =============================== */
        if (linkBtn) {
            linkBtn.addEventListener('click', (e) => {
                e.stopPropagation();

                const url = linkBtn.dataset.url;
                if (url) {
                    window.open(url, '_blank', 'noopener');
                }
            });
        }
    });
});