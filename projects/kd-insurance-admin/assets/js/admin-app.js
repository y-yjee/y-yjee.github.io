/* 관리자 데모 페이지 제어 스크립트
   기능: 탭 전환, 비디오 재생/일시정지, 반응형 설명 텍스트 대응 */
document.addEventListener("DOMContentLoaded", () => {

    const tabs = document.querySelectorAll(".tab_item");     
    const video = document.getElementById("mainVideo");      
    const desc = document.getElementById("videoDesc");       
    const control = document.getElementById("videoControl");
    const wrap = document.querySelector(".video_wrap");      

    // 탭 변경 시 영상 및 설명 업데이트
    function updateContent(tab) {
        if (!tab) return;

        const { video: videoSrc, poster: posterSrc, descPc, descMo } = tab.dataset;
        const isMobile = window.innerWidth <= 768;

        // 영상 초기화 및 교체
        video.pause();
        video.src = videoSrc;
        video.poster = posterSrc;
        video.currentTime = 0;

        // 텍스트 업데이트 및 활성화 표시
        desc.textContent = isMobile ? descMo : descPc;
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        wrap.classList.remove("playing");
    }

    // 재생 상태 토글
    function togglePlay() {
        video.paused ? video.play() : video.pause();
    }

    // 이벤트 리스너 등록
    tabs.forEach(tab => {
        tab.addEventListener("click", () => updateContent(tab));
    });

    control.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePlay();
    });

    video.addEventListener("click", togglePlay);

    // 비디오 상태에 따른 UI 동기화
    video.addEventListener("play", () => {
        wrap.classList.add("playing");
        control.innerHTML = '<i class="fa fa-pause"></i>';
    });

    video.addEventListener("pause", () => {
        wrap.classList.remove("playing");
        control.innerHTML = '<i class="fa fa-play"></i>';
    });

    // 화면 크기 변경 시 설명 문구만 업데이트 (디바운스 대신 간단한 체크)
    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
        if (window.innerWidth !== lastWidth) {
            const activeTab = document.querySelector(".tab_item.active");
            updateContent(activeTab);
            lastWidth = window.innerWidth;
        }
    });

    // 초기 실행
    updateContent(document.querySelector(".tab_item.active"));
});
