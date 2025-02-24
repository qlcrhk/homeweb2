document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");

  // URL에서 category 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category") || "all";

  async function fetchProperties(propertyType = "all") {
    console.log("📌 선택한 propertyType:", propertyType);

    try {
        const response = await fetch(`/api/properties?propertyType=${propertyType}`);
        const properties = await response.json();
        console.log("📌 서버에서 가져온 매물 데이터:", properties);

        updateMap(properties);
        updateSidebar(properties);
    } catch (error) {
        console.error("🔥 매물 불러오기 오류:", error);
    }
  }

  filterButtons.forEach(button => {
      button.addEventListener("click", (event) => {
          const propertyType = event.target.getAttribute("data-type");
          fetchProperties(propertyType);
      });
  });

  fetchProperties(initialCategory); // 초기 로딩 시 URL에서 가져온 카테고리 적용

  function updateMap(properties) {
    if (typeof kakao === "undefined" || !kakao.maps) {
      console.error("🔥 카카오 지도 API가 로드되지 않았습니다.");
      return;
    }

    const mapContainer = document.getElementById("map");
    const mapOption = {
      center: new kakao.maps.LatLng(35.880054, 128.630139),
      level: 5
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);

    properties.forEach(property => {
      if (property.lat && property.lng) {
        const markerPosition = new kakao.maps.LatLng(property.lat, property.lng);
        const marker = new kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);

        const infoWindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:10px;"><strong>${property.title}</strong><br>${property.price}만원</div>`
        });

        kakao.maps.event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });
      }
    });
  }

  function updateSidebar(properties) {
    const listContainer = document.getElementById("propertyList");

    if (!listContainer) {
        console.warn("⚠️ 리스트 컨테이너(#propertyList)가 존재하지 않습니다.");
        return;
    }

    listContainer.innerHTML = "";

    console.log("📌 사이드바에 표시할 매물 데이터:", properties);

    if (properties.length === 0) {
        listContainer.innerHTML = "<p>검색된 매물이 없습니다.</p>";
        return;
    }

    properties.forEach((property, index) => {
        console.log(`📌 사이드바 매물 ${index + 1}:`, property);

        if (!property.title) {
            console.warn(`⚠️ 매물 ${index + 1}에 제목 정보가 없습니다.`);
            return;
        }

        const imageUrl = property.images && property.images.length > 0
            ? property.images[0]
            : "/images/default-image.jpg";

        const price = property.price ? `${property.price.toLocaleString()}만원` : "가격 정보 없음";
        const address = property.address ? property.address : "주소 정보 없음";

        const listItem = document.createElement("li");
        listItem.className = "property-item";

        listItem.innerHTML = `
            <div class="property-card">
                <img src="${imageUrl}" alt="매물 이미지" class="property-image">
                <div class="property-info">
                    <h3>${property.title}</h3>
                    <p><strong>가격:</strong> ${price}</p>
                    <p><strong>주소:</strong> ${address}</p>
                </div>
            </div>
        `;

        listContainer.appendChild(listItem);
    });
  }
});