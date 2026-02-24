/* ======================================================
   About FAQ 토글 + 미모티콘 변경
   ------------------------------------------------------
   ▪ PC / Mobile 공통 1단 구조
   ▪ 전체 보기 / 전체 접기
   ▪ 개별 FAQ 단독 토글
   ▪ FAQ 열림 상태에 따라 미모티콘 이미지 변경
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {

    /* ==================================================
       요소 선택
    ================================================== */

    // 전체 보기 / 전체 접기 버튼
    const toggleBtn = document.querySelector(".round_btn");

    // 버튼 텍스트 노드 ("전체 보기" / "전체 접기")
    // HTML 구조: [텍스트노드] + <img>
    const toggleBtnText = toggleBtn.childNodes[0];

    // 모든 FAQ 아이템
    const faqItems = document.querySelectorAll(".faq_item");

    // 미모티콘 이미지
    const mimoImg = document.querySelector(".about_img img");

    // 미모티콘 이미지 경로
    const MIMO_DEFAULT = "./assets/images/mimoticon1.png";
    const MIMO_ACTIVE  = "./assets/images/mimoticon2.png";

    // 전체 열림 상태 플래그
    let isAllOpen = false;


    /* ==================================================
       미모티콘 상태 업데이트 함수
       ▪ 하나라도 FAQ가 열려 있으면 → mimoticon2
       ▪ 전부 닫혀 있으면 → mimoticon1
    ================================================== */
    function updateMimoticon() {
        const hasActive = document.querySelector(".faq_item.active");
        // 이미지 변경
        mimoImg.src = hasActive ? MIMO_ACTIVE : MIMO_DEFAULT;

        // 살짝 살아나는 효과 (scale / glow)
        mimoImg.classList.toggle("active", hasActive);
    }


    /* ==================================================
       전체 보기 / 전체 접기 버튼 클릭
    ================================================== */
    toggleBtn.addEventListener("click", () => {

        // 전체 열림 상태 반전
        isAllOpen = !isAllOpen;

        faqItems.forEach(item => {
            const answer = item.querySelector(".faq_answer");

            if (isAllOpen) {
                // 전체 열기
                item.classList.add("active");
                answer.classList.add("show");
            } else {
                // 전체 닫기
                item.classList.remove("active");
                answer.classList.remove("show");
            }
        });

        // 버튼 상태 변경
        toggleBtn.classList.toggle("active", isAllOpen);
        toggleBtnText.textContent = isAllOpen ? "전체 접기 " : "전체 보기 ";

        // 미모티콘 상태 업데이트
        updateMimoticon();
    });


    /* ==================================================
       개별 FAQ 토글 (PC / Mobile 공통)
       ▪ 하나만 열리도록 동작
    ================================================== */
    faqItems.forEach(item => {

        const question = item.querySelector(".faq_question");
        const answer = item.querySelector(".faq_answer");

        question.addEventListener("click", () => {

            const isActive = item.classList.contains("active");

            // 모든 FAQ 닫기
            faqItems.forEach(other => {
                other.classList.remove("active");
                other.querySelector(".faq_answer").classList.remove("show");
            });

            // 이미 열려 있던 게 아니면 다시 열기
            if (!isActive) {
                item.classList.add("active");
                answer.classList.add("show");
            }

            // 전체보기 버튼 상태 초기화
            isAllOpen = false;
            toggleBtn.classList.remove("active");
            toggleBtnText.textContent = "전체 보기 ";

            // 미모티콘 상태 업데이트
            updateMimoticon();
        });
    });

});