document.getElementById("writeForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const authorElement = document.getElementById("author");
    const author = authorElement ? authorElement.value.trim() : "익명"; // 작성자 필드가 없으면 기본값 설정

    console.log("📌 title:", title);
    console.log("📌 content:", content);
    console.log("📌 author:", author);

    if (!title || !content) {
        return alert("⚠️ 제목과 내용을 입력하세요.");
    }

    try {
        const response = await fetch("/api/community", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content, author })
        });

        console.log("📥 서버 응답:", response);

        const result = await response.json();

        if (response.ok) {
            alert("✅ 게시글이 등록되었습니다.");
            window.location.href = "/community";
        } else {
            alert("❌ 게시글 등록 실패: " + result.message);
        }
    } catch (error) {
        console.error("❌ 게시글 작성 오류:", error);
    }
});
