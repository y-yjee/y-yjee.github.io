// 이용 안내 탭
$(document).ready(function () {
  // 초기에 #use만 보이도록 설정
  $("#faq_img").show();
  $("#question-list").hide();

  // 탭 클릭 이벤트
  $(".faq li").click(function () {
    var target = $(this).data("target"); // "use" 또는 "return"

    // 모든 콘텐츠 숨기고, 클릭한 대상만 보이게
    $(".hide_content").hide();
    $("#" + target).show();

    // 탭 버튼 활성화 스타일
    $(".faq li").removeClass("on");
    $(this).addClass("on");
  });
});