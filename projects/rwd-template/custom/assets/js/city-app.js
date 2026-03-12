// 메인 이미지 슬라이드 효과
$(function () {
  $('.slide_gallery').bxSlider({
    mode: 'horizontal',    // 슬라이드 방향
    speed: 1000,           // 슬라이드 전환 속도 (ms)
    pause: 3000,           // 각 슬라이드 유지 시간 (ms)
    pager: true,           // ✔ 불릿 내비게이션 표시 (boolean)
    controls: true,        // ✔ 좌우 화살표
    auto: true,            // 자동 슬라이드 실행
    autoHover: true,       // 마우스 올리면 멈춤
    touchEnabled: true     // 모바일 스와이프
  });
});