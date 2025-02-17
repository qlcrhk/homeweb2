document.addEventListener("DOMContentLoaded", async () => {
    const postList = document.getElementById("post-list");

    try {
        const response = await fetch("/api/community");

        if (!response.ok) throw new Error("게시글을 불러올 수 없습니다.");

        const posts = await response.json();

        if (posts.length === 0) {
            postList.innerHTML = "<p>📭 게시글이 없습니다.</p>";
            return;
        }

        const fragment = document.createDocumentFragment();

        posts.forEach((post) => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="/community-detail?id=${post._id}">${post.title}</a> - ${post.author}`;
            fragment.appendChild(li);
        });

        postList.appendChild(fragment);
    } catch (error) {
        console.error("❌ 게시글 목록 불러오기 실패:", error);
        postList.innerHTML = "<p>⚠️ 게시글을 불러오지 못했습니다.</p>";
    }
});
