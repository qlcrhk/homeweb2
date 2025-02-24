document.addEventListener("DOMContentLoaded", async () => {
    // URL 경로를 슬래시('/')로 분리하여 마지막 요소를 매물 ID로 사용
    const pathSegments = window.location.pathname.split("/");
    const propertyId = pathSegments[pathSegments.length - 1];
  
    console.log(propertyId);
  
    if (!propertyId) {
      document.body.innerHTML = "<h2>잘못된 요청입니다. 매물 ID가 필요합니다.</h2>";
      return;
    }
  
    try {
      // API 요청: propertyId를 활용해 상세 매물 정보를 가져옴
      const response = await fetch(`/api/properties/detail/${propertyId}`);
      if (!response.ok) {
        throw new Error("매물 정보를 불러올 수 없습니다.");
      }
      const property = await response.json();
  
      // HTML 요소에 데이터를 삽입
      document.getElementById("title").textContent = property.title;
      document.getElementById("address").textContent = property.address;
      document.getElementById("price").textContent = `₩${property.price.toLocaleString()}`;
      document.getElementById("description").textContent = property.description;
  
      // 이미지 갤러리 처리
      // HTML에 <img id="main-image">와 <div id="thumbnails"> 요소가 있어야 함
      const mainImage = document.getElementById("main-image");
      const thumbnailsContainer = document.getElementById("thumbnails");
  
      if (Array.isArray(property.images) && property.images.length === 4) {
        // 첫 번째 이미지를 메인이미지로 설정
        mainImage.src = property.images[0];
  
        // 썸네일 영역 초기화
        thumbnailsContainer.innerHTML = "";
  
        // 이미지 배열의 모든 4개 이미지를 썸네일로 생성
        property.images.forEach(src => {
          const thumbImg = document.createElement("img");
          thumbImg.src = src;
          thumbImg.style.cursor = "pointer";
          thumbImg.style.marginRight = "10px";
          // 썸네일 클릭 시 메인이미지 변경
          thumbImg.addEventListener("click", () => {
            mainImage.src = src;
          });
          thumbnailsContainer.appendChild(thumbImg);
        });
      } else {
        // 이미지 배열이 4개가 아닐 경우, 첫 번째 이미지를 메인으로 설정하고 나머지는 썸네일로 처리
        mainImage.src = property.images[0] || "placeholder-image.jpg";
        thumbnailsContainer.innerHTML = "";
        if (Array.isArray(property.images)) {
          property.images.forEach(src => {
            const thumbImg = document.createElement("img");
            thumbImg.src = src;
            thumbImg.style.cursor = "pointer";
            thumbImg.style.marginRight = "10px";
            thumbImg.addEventListener("click", () => {
              mainImage.src = src;
            });
            thumbnailsContainer.appendChild(thumbImg);
          });
        }
      }
    } catch (error) {
      console.error("🔥 매물 불러오기 실패:", error);
      document.body.innerHTML = "<h2>매물 정보를 가져오는 중 오류가 발생했습니다.</h2>";
    }
  });
  