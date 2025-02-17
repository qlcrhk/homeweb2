document.addEventListener("DOMContentLoaded", async () => {
    const loginForm = document.getElementById("login-form"); // 로그인 폼
    const signupForm = document.getElementById("signup-form"); // 회원가입 폼
    const userInfo = document.getElementById("user-info"); // 사용자 정보 표시 영역
    const adminMenu = document.getElementById("admin-menu"); // 관리자 메뉴 (네비게이션 바)

    // ✅ 회원가입 이벤트 리스너
    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // 폼 기본 동작(페이지 새로고침) 방지

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                // 서버로 회원가입 요청
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                });

                if (!response.ok) throw new Error("회원가입 실패"); // 응답이 실패하면 오류 발생

                alert("✅ 회원가입 성공! 로그인 해주세요.");
                window.location.href = "/login"; // 로그인 페이지로 이동
            } catch (error) {
                console.error(error);
            }
        });
    }

    // ✅ 로그인 이벤트 리스너
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // 폼 기본 동작(페이지 새로고침) 방지

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                // 서버로 로그인 요청
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message); // 로그인 실패 시 오류 발생

                localStorage.setItem("token", data.token); // 로그인 성공 시 토큰 저장
                alert("✅ 로그인 성공!"); // 로그인 성공 메시지
                window.location.href = "/"; // 홈으로 이동
            } catch (error) {
                console.error(error);
                alert("❌ 잘못된 이메일 또는 비밀번호입니다."); // 🚨 잘못된 로그인 시 경고창 띄우기
            }
        });
    }

    // ✅ 로그인 상태 확인 (UI 업데이트)
    async function updateUI() {
        const token = localStorage.getItem("token"); // 저장된 토큰 가져오기

        if (userInfo) {
            if (token) {
                try {
                    // 서버에서 로그인된 사용자 정보 가져오기
                    const response = await fetch("/api/auth/me", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) throw new Error("사용자 정보 가져오기 실패");

                    const data = await response.json(); // 사용자 데이터 저장

                    // ✅ 로그인 상태: 유저 이름 + 로그아웃 버튼 표시
                    userInfo.innerHTML = `
                        <div class="username"><strong>${data.name}</strong> ${data.isAdmin ? "관리자님" : "님"} 
                        <button id="logout-btn">로그아웃</button></div>
                    `;

                    // ✅ 관리자일 경우 "관리자 메뉴" 표시
                    if (data.isAdmin && adminMenu) {
                        adminMenu.style.display = "block";
                    }
                } catch (error) {
                    console.error(error);
                    userInfo.innerHTML = `<a href="/login">Login</a>`; // 로그인 버튼 표시
                }
            } else {
                userInfo.innerHTML = `<a href="/login">Login</a>`; // 로그인 버튼 표시
            }
        }
    }

    // ✅ 로그아웃 이벤트 리스너 (동적으로 생성된 버튼을 감지)
    document.addEventListener("click", (event) => {
        if (event.target.id === "logout-btn") {
            localStorage.removeItem("token"); // 저장된 토큰 삭제
            alert("✅ 로그아웃 완료!"); // 로그아웃 메시지 출력
            window.location.href = "/login"; // 로그인 페이지로 이동
        }
    });

    // ✅ 페이지 로드 시 UI 업데이트 실행
    updateUI();
});
