document.addEventListener("DOMContentLoaded", async () => {
    const propertyForm = document.getElementById("property-form");
    const logoutBtn = document.getElementById("logout-btn");
    const imageContainer = document.getElementById("image-container");
    const addImageBtn = document.getElementById("add-image");

    // ✅ 관리자 확인 (일반 사용자 접근 차단)
    async function checkAdmin() {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ 로그인이 필요합니다.");
            window.location.href = "/login";
            return false;
        }

        try {
            const response = await fetch("/api/auth/me", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "인증 실패");

            if (!data.isAdmin) {
                alert("❌ 관리자만 접근 가능합니다.");
                window.location.href = "/";
                return false;
            }

            return true;
        } catch (error) {
            console.error(error);
            alert("❌ 인증 오류가 발생했습니다.");
            window.location.href = "/";
            return false;
        }
    }

    // 🚀 관리자 체크 후 실행
    if (!(await checkAdmin())) return;

    // ✅ 이미지 입력 필드 추가 (최대 4개 제한)
    addImageBtn.addEventListener("click", () => {
        const imageInputs = document.querySelectorAll(".image-url");
        if (imageInputs.length >= 4) {
            alert("❌ 이미지는 최대 4개까지 추가할 수 있습니다.");
            return;
        }

        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.className = "image-url";
        newInput.placeholder = "이미지 URL 입력";
        imageContainer.appendChild(newInput);
    });

    // ✅ 매물 등록 요청
    if (propertyForm) {
        propertyForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const title = document.getElementById("title").value.trim();
            const address = document.getElementById("address").value.trim();
            const price = document.getElementById("price").value.trim();
            const propertyType = document.getElementById("property-type").value;
            const description = document.getElementById("description").value.trim();

            // 🔸 필수 입력값 검증
            if (!title || !address || !price || !propertyType || !description) {
                alert("❌ 모든 필수 입력란을 채워주세요.");
                return;
            }

            if (isNaN(price) || Number(price) <= 0) {
                alert("❌ 가격은 숫자로 입력해야 합니다.");
                return;
            }

            const images = [];
            document.querySelectorAll(".image-url").forEach(input => {
                if (input.value.trim()) images.push(input.value.trim());
            });

            try {
                const response = await fetch("/api/properties/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ title, address, price, propertyType, description, images })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "매물 등록 실패");

                alert("✅ 매물이 등록되었습니다!");
                window.location.href = "/";
            } catch (error) {
                console.error(error);
                alert(`❌ 매물 등록 실패! ${error.message}`);
            }
        });
    }

    // ✅ 로그아웃
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            alert("✅ 로그아웃 완료!");
            window.location.href = "/login";
        });
    }
});
