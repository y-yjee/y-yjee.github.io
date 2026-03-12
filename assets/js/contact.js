document.addEventListener("DOMContentLoaded", () => {

    const contactList = document.querySelector('.contact__list');
    const contactItems = document.querySelectorAll('.contact__item');

    if (!contactList) return;

    /* ===============================
       Close all cards helper
    =============================== */
    const closeAll = () => {
        contactItems.forEach(item => {
            item.classList.remove('is-flipped');
        });
    };

    /* ===============================
       Event Delegation
    =============================== */
    contactList.addEventListener('click', (e) => {

        const item = e.target.closest('.contact__item');
        if (!item) return;

        /* Front click → flip */
        if (e.target.closest('.contact__face--front')) {
            closeAll();
            item.classList.add('is-flipped');
            return;
        }

        /* Close button */
        if (e.target.closest('.contact__close')) {
            item.classList.remove('is-flipped');
            return;
        }

        /* Link button */
        const linkBtn = e.target.closest('.contact__link');
        if (linkBtn) {
            const url = linkBtn.dataset.url;
            if (url) {
                window.open(url, '_blank', 'noopener');
            }
        }

    });

});