document.addEventListener("DOMContentLoaded", () => {

    const about = document.querySelector(".about");
    if (!about) return;

    const faqContainer = about.querySelector(".about__faq");
    const toggleBtn = about.querySelector(".round-btn");
    const toggleBtnText = toggleBtn?.childNodes[0];
    const faqItems = about.querySelectorAll(".about__faq-item");

    if (!faqContainer || !toggleBtn) return;

    let isAllOpen = false;

    /* =========================================
       1. Utility Functions
    ========================================= */

    function closeAll() {
        faqItems.forEach(item => item.classList.remove("is-open"));
    }

    function updateMimoticonState() {
        const hasOpen = about.querySelector(".about__faq-item.is-open");
        about.classList.toggle("is-active", !!hasOpen);
    }

    function updateToggleButton(state) {
        toggleBtn.classList.toggle("active", state);
        toggleBtnText.textContent = state ? "전체 접기 " : "전체 보기 ";
    }

    /* =========================================
       2. Toggle All Button
    ========================================= */

    toggleBtn.addEventListener("click", () => {

        isAllOpen = !isAllOpen;

        if (isAllOpen) {
            faqItems.forEach(item => item.classList.add("is-open"));
        } else {
            closeAll();
        }

        updateToggleButton(isAllOpen);
        updateMimoticonState();
    });

    /* =========================================
       3. Event Delegation for FAQ
    ========================================= */

    faqContainer.addEventListener("click", (e) => {

        const question = e.target.closest(".about__faq-question");
        if (!question) return;

        const item = question.closest(".about__faq-item");
        const isOpen = item.classList.contains("is-open");

        closeAll();

        if (!isOpen) {
            item.classList.add("is-open");
        }

        isAllOpen = false;
        updateToggleButton(false);
        updateMimoticonState();
    });

});