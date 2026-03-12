// 미완성 페이지 알림창 효과
$(document).ready(function () {
  $('body').append('<div class="alert"><img src="./images/alert.png" alt="준비중 알람창"></div>')
  $('a[href="#"]').click(function(e){
      e.preventDefault();
      $('.alert').stop().fadeIn(800); // alert 표시
      setTimeout(function(){
          $('.alert').stop().fadeOut(800);
      },3000);
  })
})


// 메인 이미지 슬라이드 효과
$(function () {
  $('.slide_gallery').bxSlider({
    mode: 'horizontal',    // 슬라이드 방향
    speed: 1000,           // 슬라이드 전환 속도 (ms)
    pause: 3500,           // 각 슬라이드 유지 시간 (ms)
    pager: true,           // ✔ 불릿 내비게이션 표시 (boolean)
    auto: true,            // 자동 슬라이드 실행
    autoHover: true,       // 마우스 올리면 멈춤
    slideWidth: 1060       // 슬라이드 너비
  });
});

// 이용 안내 탭
$(document).ready(function () {
  // 초기에 #use만 보이도록 설정
  $("#use").show();
  $("#return").hide();

  // 탭 클릭 이벤트
  $(".info_banner div").click(function () {
    var target = $(this).data("target"); // "use" 또는 "return"

    // 모든 콘텐츠 숨기고, 클릭한 대상만 보이게
    $(".info_img").hide();
    $("#" + target).show();

    // 탭 버튼 활성화 스타일
    $(".info_banner div").removeClass("on");
    $(this).addClass("on");
  });
});


// 버튼시 이미지 전환 효과
$(document).ready(function() {
  // 번호별 버튼 클릭 시
  $(".course_button .cbtn").click(function() {
    // 클래스 중 "btn숫자" 부분에서 숫자 추출
    var className = $(this).attr("class");
    var num = className.match(/btn(\d+)/)[1]; // 정규식으로 숫자만 추출

    // 이미지 경로 설정
    var imgPath = `./images/index/course/seoul-map${num}.png`;

    // 이미지 변경
    $("#mainMap").attr("src", imgPath);

    // 모든 버튼의 active 제거하고 클릭된 버튼에만 active 추가
    $(".course_button .cbtn").removeClass("active");
    $(this).addClass("active");
  });

  // 전체 코스 보기 버튼 클릭 시 이미지 원래대로 + active 제거
  $(".main_btn").click(function() {
    $("#mainMap").attr("src", "./images/index/course/seoul-map.png");
    $(".course_button .cbtn").removeClass("active"); // active 클래스 제거
  });
});



// 배너
$(document).ready(function () {
  const sideWrap = $('#sideWrap');
  const imageBox = $('#imageBox');

  // hover 시 slide in
  $('#toggleBtn').on('mouseenter', function () {
    sideWrap.addClass('hidden');

    setTimeout(() => {
      imageBox.css('display', 'block');

      setTimeout(() => {
        imageBox.removeClass('hidden');
      }, 10); // CSS transition 작동
    }, 400);
  });

  // 마우스가 imageBox를 벗어나면 다시 숨김
  $('#imageBox').on('mouseleave', function () {
    imageBox.addClass('hidden');

    setTimeout(() => {
      imageBox.css('display', 'none');
      sideWrap.removeClass('hidden');
    }, 400);
  });
});

// 지도
$(document).ready(function(){
    kakao.maps.load(() => {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 6
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);

      const stationInfoUrl = 'http://openapi.seoul.go.kr:8088/68555572706375623630754e714f44/json/bikeStationMaster/1/1000/';
      const realtimeStatusUrl = 'http://openapi.seoul.go.kr:8088/68555572706375623630754e714f44/json/stationRealtimeStatus/1/1000/';

      Promise.all([
        fetch(stationInfoUrl).then(res => res.json()),
        fetch(realtimeStatusUrl).then(res => res.json())
      ])
      .then(([infoData, statusData]) => {
        const stations = infoData.bikeStationMaster?.row || [];
        const statuses = statusData.stationRealtimeStatus?.row || [];

        // 실시간 상태를 RNTLS_ID 키로 맵 생성
        const statusMap = new Map();
        statuses.forEach(s => {
          statusMap.set(s.RNTLS_ID, s);
        });

        let currentInfoWindow = null;

        stations.forEach(station => {
          const lat = parseFloat(station.LAT);
          const lng = parseFloat(station.LOT);
          if (!lat || !lng) return;

          const position = new kakao.maps.LatLng(lat, lng);

          // 커스텀 동그라미 마커를 위한 DOM 생성
          const markerDiv = document.createElement('div');
          markerDiv.className = 'custom-marker';
          markerDiv.title = `${station.RNTLS_ID} - ${station.ADDR1}`;

          const customOverlay = new kakao.maps.CustomOverlay({
            position,
            content: markerDiv,
            yAnchor: 0.5
          });
          customOverlay.setMap(map);

          const realtime = statusMap.get(station.RNTLS_ID) || {};

          const bookmarkText = `<div class="bookmark" onclick="alert('즐겨찾기 등록: ${station.RNTLS_ID}')">즐겨찾기 등록</div>`;

          const content = `
            <div class="infowindow">
              <strong>${station.RNTLS_ID}.</strong> ${station.ADDR1} ${station.ADDR2}<br/>
              일반 따릉이: ${realtime.NRM_BIKE_CNT ?? '정보 없음'}<br/>
              새싹 따릉이: ${realtime.NEW_BIKE_CNT ?? '정보 없음'}<br/>
              ${bookmarkText}
            </div>
          `;

          const infowindow = new kakao.maps.InfoWindow({ content });

          markerDiv.addEventListener('click', () => {
            if (currentInfoWindow) {
              currentInfoWindow.close();
              if (currentInfoWindow === infowindow) {
                currentInfoWindow = null;
                return; // 토글 닫기
              }
            }
            infowindow.open(map, customOverlay);
            currentInfoWindow = infowindow;
          });
        });
      })
      .catch(err => {
        console.error('API 호출 실패:', err);
      });
    });
})