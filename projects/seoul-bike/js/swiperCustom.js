// Swiper 생성 | .swiper-container 스와이퍼 최상위 구조 클래스
var swiper = new Swiper('.swiper-container',{
    /* a. 슬라이드 보이는 갯수 */
    slidesPerView: 1.52,
    /* b. 슬라이드 사이 간격 */
    spaceBetween: '10.33333%',
    /* c. 슬라이드 반복 여부 */
    loop: true,
    /* d. 그룹수 맞추기 => 안 맞을 경우 빈칸으로 채우기 여부 */
    loopFillGroupWidthBlank: true,
    /* e. 활성 슬라이드 항상 가운데 배치 여부 */
    centeredSlides: true,

    /* 페이징, 넘버링 */
    pagination: {
        // 블릿 적용 클래스명
        el: '.swiper-pagination',
        // 점박이 블릿형
        type: 'bullets',
        // 블릿 클릭시 이동
        clickable: true,
        // 1/n = 숫자형
        type: 'fraction',
    },

    /* 네비게이션 좌우 화살표 */
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }

});