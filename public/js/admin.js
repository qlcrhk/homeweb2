document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        if (!data.isAdmin) {
            alert("관리자만 접근할 수 있습니다.");
            window.location.href = "/";
        }
    } catch (error) {
        alert("인증 오류가 발생했습니다.");
        window.location.href = "/login";
    }
});
