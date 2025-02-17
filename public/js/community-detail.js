document.addEventListener("DOMContentLoaded", async () => {
    const postId = new URLSearchParams(window.location.search).get("id");

    if (!postId) {
        alert("🚨 잘못된 접근입니다.");
        window.location.href = "/community.html";
        return;
    }

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/community/${postId}`);
            if (!response.ok) throw new Error("게시글을 불러올 수 없습니다.");

            const post = await response.json();

            if (!post || !post.title || !post.content) throw new Error("게시글 데이터가 올바르지 않습니다.");

            document.getElementById("post-title").textContent = post.title;
            document.getElementById("post-author").textContent = `작성자: ${post.author}`;
            document.getElementById("post-date").textContent = `작성일: ${new Date(post.createdAt).toLocaleString()}`;
            document.getElementById("post-content").textContent = post.content;
        } catch (error) {
            console.error("❌ 게시글 로드 실패:", error);
            alert(error.message);
            window.location.href = "/community.html";
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/community/${postId}/comments`);
            if (!response.ok) throw new Error("댓글을 불러올 수 없습니다.");

            const comments = await response.json();
            const commentList = document.getElementById("comment-list");
            commentList.innerHTML = "";

            if (comments.length === 0) {
                commentList.innerHTML = "<p>💬 댓글이 없습니다.</p>";
                return;
            }

            const fragment = document.createDocumentFragment();

            comments.forEach(comment => {
                const li = document.createElement("li");
                li.textContent = `${comment.author}: ${comment.text} (${new Date(comment.createdAt).toLocaleString()})`;
                fragment.appendChild(li);
            });

            commentList.appendChild(fragment);
        } catch (error) {
            console.error("❌ 댓글 로드 오류:", error);
        }
    };

    document.getElementById("comment-submit").addEventListener("click", async () => {
        const commentInput = document.getElementById("comment-input");
        const text = commentInput.value.trim();

        if (!text) return alert("⚠️ 댓글을 입력하세요.");

        try {
            const response = await fetch(`/api/community/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) throw new Error("댓글 등록 실패");

            commentInput.value = "";
            fetchComments();
        } catch (error) {
            console.error("❌ 댓글 등록 실패:", error);
            alert(error.message);
        }
    });

    document.getElementById("delete-button").addEventListener("click", async () => {
        const isAdmin = confirm("⚠️ 관리자 계정으로 삭제하시겠습니까?");
        if (!isAdmin) return alert("❌ 삭제 권한이 없습니다.");

        try {
            const response = await fetch(`/api/community/${postId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAdmin: true })
            });

            if (!response.ok) throw new Error("❌ 게시글 삭제 실패");

            alert("✅ 게시글이 삭제되었습니다.");
            window.location.href = "/community.html";
        } catch (error) {
            console.error("❌ 게시글 삭제 오류:", error);
            alert(error.message);
        }
    });

    document.getElementById("edit-button").addEventListener("click", () => {
        window.location.href = `/edit.html?id=${postId}`;
    });

    fetchPost();
    fetchComments();
});
