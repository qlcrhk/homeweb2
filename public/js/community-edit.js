document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        alert("🚨 잘못된 접근입니다.");
        window.location.href = "/community.html";
        return;
    }

    const postIdField = document.getElementById("postId");
    if (postIdField) postIdField.value = postId;

    try {
        const response = await fetch(`/api/community/${postId}`);

        if (!response.ok) {
            throw new Error("게시글 불러오기 실패");
        }

        const post = await response.json();

        if (!post || !post.title || !post.content) {
            throw new Error("게시글 데이터가 올바르지 않습니다.");
        }

        document.getElementById("title").value = post.title;
        document.getElementById("content").value = post.content;
    } catch (error) {
        console.error("❌ 게시글 로드 실패:", error);
        alert("게시글을 불러올 수 없습니다.");
        window.location.href = "/community.html";
    }
});

document.getElementById("editForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const postIdField = document.getElementById("postId");

    if (!postIdField) {
        alert("🚨 게시글 ID가 없습니다.");
        return;
    }

    const postId = postIdField.value;
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
        alert("⚠️ 제목과 내용을 입력해주세요.");
        return;
    }

    try {
        const response = await fetch(`/api/community/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });

        if (!response.ok) {
            throw new Error("게시글 수정 실패");
        }

        alert("✅ 게시글이 수정되었습니다.");
        window.location.href = "/community.html";
    } catch (error) {
        console.error("❌ 게시글 수정 실패:", error);
        alert("게시글 수정에 실패했습니다.");
    }
});
