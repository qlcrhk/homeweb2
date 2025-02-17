document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");
  
    // 이메일 로그인 처리
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
  
        localStorage.setItem("token", data.token);
        alert("로그인 성공!");
        window.location.href = "/"; // 메인 페이지로 이동
      } catch (error) {
        loginError.textContent = error.message;
      }
    });
  
    // 네이버 로그인 버튼 클릭 시
    document.getElementById("naver-login").addEventListener("click", () => {
      window.location.href = "/api/auth/naver"; // 네이버 로그인 페이지로 이동
    });
  
    // 카카오 로그인 버튼 클릭 시
    document.getElementById("kakao-login").addEventListener("click", () => {
      window.location.href = "/api/auth/kakao"; // 카카오 로그인 페이지로 이동
    });
  });
  