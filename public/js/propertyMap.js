document.addEventListener("DOMContentLoaded", async () => {
    // ✅ 1. 매물 데이터 불러오기
    const response = await fetch("/api/properties");
    const properties = await response.json();

    // ✅ 2. 카카오 지도 API 로드
    kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const mapOption = {
            center: new kakao.maps.LatLng(35.880054, 128.630139), // 기본 중심 좌표 (동대구역역)
            level: 5 // 줌 레벨
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);

        // ✅ 3. 매물 데이터를 지도에 마커로 추가
        properties.forEach(property => {
            if (property.lat && property.lng) {
                const markerPosition = new kakao.maps.LatLng(property.lat, property.lng);
                const marker = new kakao.maps.Marker({ position: markerPosition });

                // 지도에 마커 표시
                marker.setMap(map);

                // 마커 클릭 시 정보창 표시
                const infoWindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:10px;"><strong>${property.title}</strong><br>${property.price}만원</div>`
                });

                kakao.maps.event.addListener(marker, "click", () => {
                    infoWindow.open(map, marker);
                });
            }
        });
    });
});
