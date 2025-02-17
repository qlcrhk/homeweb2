document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const closeModal = document.querySelector(".close");
    document
    .querySelector(".mobile-menu-btn")
    .addEventListener("click", function () {
      this.classList.toggle("active");
      document.querySelector(".nav-container").classList.toggle("active");
    });

    // 버튼 별 내용 설정
    const modalData = {
      회사소개:
        "비둘기부동산은 신뢰와 전문성을 바탕으로 한 대한민국 대표 부동산 플랫폼입니다. 12년 이상의 경험을 가진 전문가들이 고객 맞춤형 부동산 정보를 제공합니다. 원룸, 아파트, 빌라, 상업용 부동산까지 다양한 매물을 한눈에 비교할 수 있으며, 최신 AI 기술을 활용해 최적의 매물을 추천합니다. 비둘기부동산은 공정하고 투명한 거래를 최우선으로 하며, 고객의 안전한 계약을 돕기 위해 법률 상담 서비스도 제공하고 있습니다. 앞으로도 신뢰받는 부동산 플랫폼이 되도록 최선을 다하겠습니다.",

      이용약관:
        "제1조 (목적) 이 약관은 비둘기부동산(이하 '회사')이 제공하는 부동산 정보 서비스의 이용 조건 및 절차를 규정하는 것을 목적으로 합니다. 제2조 (정의) ① '회원'이란 본 약관에 동의하고 서비스를 이용하는 개인 또는 법인을 의미합니다. ② '서비스'란 회사가 제공하는 부동산 매물 검색, 계약 상담 등의 온라인 플랫폼을 의미합니다. 제3조 (서비스 이용 및 제한) ① 회원은 본 약관을 준수하는 범위 내에서 자유롭게 서비스를 이용할 수 있습니다. ② 회사는 회원의 서비스 이용이 법령을 위반하거나 부당한 목적을 가질 경우 이용을 제한할 수 있습니다. 제4조 (면책조항) ① 회사는 매물 정보의 정확성에 대한 법적 책임을 지지 않으며, 이용자는 계약 전 반드시 직접 확인해야 합니다.",

      개인정보처리방침:
        "제1조 (목적) 비둘기부동산은 이용자의 개인정보를 보호하며, 『개인정보 보호법』에 따라 이를 안전하게 관리합니다. 제2조 (수집하는 개인정보 항목) ① 필수 정보: 이름, 연락처, 이메일, 서비스 이용 기록 ② 선택 정보: 관심 지역, 선호 매물 유형. 제3조 (개인정보 이용 목적) 회사는 다음과 같은 목적을 위해 개인정보를 이용합니다. ① 부동산 매물 추천 및 상담 서비스 제공 ② 고객 문의 응대 및 계약 지원 ③ 법적 의무 이행 및 분쟁 해결. 제4조 (보유 및 이용 기간) ① 회원 탈퇴 후 즉시 개인정보를 파기합니다. ② 단, 법률에 따라 보관이 필요한 정보는 관련 규정에 따라 일정 기간 보관될 수 있습니다.",

      "위치기반서비스 이용약관":
        "제1조 (목적) 본 약관은 비둘기부동산이 제공하는 위치기반 서비스를 이용하는 회원과 회사 간의 권리와 의무를 규정합니다. 제2조 (서비스 내용 및 이용 제한) ① 회원은 GPS, IP 등을 통해 본인의 위치를 기반으로 매물 정보를 추천받을 수 있습니다. ② 위치정보는 회원의 동의 없이 제3자에게 제공되지 않습니다. 제3조 (위치정보 보호 및 관리) ① 회사는 『위치정보의 보호 및 이용 등에 관한 법률』을 준수하여 회원의 위치정보를 보호합니다. ② 회원은 위치정보 제공을 원하지 않을 경우 설정을 통해 거부할 수 있습니다.",

      매물광고자율규약:
        "매물 광고는 관련 법령을 준수해야 하며, 허위·과장 광고를 금지합니다. 비둘기부동산은 부적절한 광고에 대해 게시 중단 및 제재 조치를 취할 수 있습니다.",

      "책임한계 및 법적고지":
        "제1조 (법적책임 제한) ① 비둘기부동산은 정보 제공 플랫폼으로, 개별 부동산 거래에 대한 법적 책임을 지지 않습니다. ② 회원은 계약 전 매물 정보 및 계약 조건을 반드시 직접 확인해야 합니다. 제2조 (지적재산권 보호) ① 본 사이트의 모든 콘텐츠(텍스트, 이미지, 데이터 등)는 저작권법에 의해 보호됩니다. ② 회사의 사전 동의 없이 콘텐츠를 무단 복제, 배포하는 것은 금지됩니다.",

      제휴문의:
        "비둘기부동산과의 제휴를 원하시면 공식 이메일(info@bidulgirealty.com) 또는 고객센터를 통해 문의해 주세요.",
    };

    // 모든 푸터 버튼에 이벤트 추가
    document.querySelectorAll(".t-btn-item button").forEach((button) => {
      button.addEventListener("click", function () {
        const btnText = this.innerText.trim();
        modalTitle.innerText = btnText;
        modalBody.innerText = modalData[btnText] || "준비 중입니다.";
        modal.style.display = "flex";
      });
    });

    // 모달 닫기
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
    });

    // 모달 바깥 클릭 시 닫기
    window.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });