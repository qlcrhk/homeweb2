document.addEventListener("DOMContentLoaded", () => {
  // 📌 Kakao 지도 초기화
  const mapContainer = document.getElementById("map");
  const mapOption = {
    center: new kakao.maps.LatLng(35.879854, 128.628648), // 서울 좌표
    level: 5, // 확대 레벨
  };
  const map = new kakao.maps.Map(mapContainer, mapOption);

  // 🟢 DB에서 매물 데이터 가져오기
  async function fetchProperties(filterType) {
    try {
      const response = await fetch(`/api/properties/search?type=${filterType}`);
      const properties = await response.json();
      console.log("📌 서버에서 가져온 매물 데이터:", properties); // 데이터 확인
      updateSidebar(properties);
    } catch (error) {
      console.error("🔥 매물 불러오기 오류:", error);
    }
  }

  // 🟢 사이드바에 매물 리스트 추가
  function updateSidebar(properties) {
    const sidebar = document.getElementById("sidebar");
    const listContainer = document.getElementById("propertyList");

    if (!sidebar) {
      console.warn("⚠️ 사이드바(#sidebar) 요소가 존재하지 않습니다.");
      return;
    }
    if (!listContainer) {
      console.warn("⚠️ 리스트 컨테이너(#propertyList)가 존재하지 않습니다.");
      return;
    }

    listContainer.innerHTML = ""; // 기존 리스트 초기화

    properties.forEach((property, index) => {
      console.log(`📌 매물 ${index + 1}:`, property);

      if (!property.title) {
        console.warn(`⚠️ 매물 ${index + 1}에 이름 정보가 없습니다.`);
        return;
      }

      // 🔵 첫 번째 이미지 가져오기 (없으면 기본 이미지 사용)
      const images = property.images && property.images.length > 0 ?
        property.images[0] :
        "default-image.jpg"; // 기본 이미지

      // 🔵 가격 및 위치 정보
      const price = property.price ? `${property.price.toLocaleString()}억 원` : "가격 정보 없음";
      const location = property.location ? property.location : "위치 정보 없음";

      // 🔵 리스트 아이템 생성 (🔥 기존 코드 유지하면서 추가)
      const listItem = document.createElement("li");
      listItem.className = "property-item"; // 기존 클래스 유지

      listItem.innerHTML = `
      <div style="display: flex gap: 1em;">
      <div>
        <img src="${images}" alt="매물 이미지" style="width: 100px; height: 100px"  class="property-image">
      </div>
        <div class="property-info">
          <h3>${property.title}</h3>
          <p><strong>가격:</strong> ${price}</p>
          <p><strong>위치:</strong> ${location}</p>
        </div>
      </div>
      `;

      listContainer.appendChild(listItem);
    });
  }

  // 🟢 검색 버튼 이벤트 추가
  document.getElementById("searchBtn").addEventListener("click", () => {
    const selectedType = document.getElementById("propertyType").value;
    fetchProperties(selectedType);
  });

  // 🟢 초기 로딩 시 전체 매물 표시
  fetchProperties("all");
});