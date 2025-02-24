document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("edit-post-form");
  
    // URL에서 수정할 글의 ID 추출 (예: /api/community/123/edit)
    const pathSegments = window.location.pathname.split("/");
    // URL이 /api/community/:id/edit 형식이라면, 마지막 전 요소가 ID입니다.
    const id = pathSegments[pathSegments.length - 2];
  
    if (!id) {
      alert("글 ID를 찾을 수 없습니다.");
      return;
    }
  
    // 폼의 action 속성을 수정하여 POST 요청 경로를 지정
    form.action = `/api/community/${id}/edit`;
  
    // 기존 글 데이터를 가져와 폼에 채워넣기 (GET /api/community/:id)
    try {
      const response = await fetch(`/api/community/${id}`);
      if (!response.ok) {
        throw new Error("글 정보를 불러올 수 없습니다.");
      }
      const post = await response.json();
      form.title.value = post.title;
      form.content.value = post.content;
      form.author.value = post.author;
    } catch (error) {
      console.error("글 불러오기 에러:", error);
      alert("글 정보를 불러오는 중 오류가 발생했습니다.");
    }
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const title = form.title.value.trim();
      const content = form.content.value.trim();
      const author = form.author.value.trim();
  
      if (!title || !content || !author) {
        alert("모든 필드를 입력해 주세요.");
        return;
      }
  
      const data = { title, content, author };
  
      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          // 수정 완료 후 목록 페이지나 상세 페이지로 이동
          window.location.href = "/community";
        } else {
          alert("글 수정 중 오류가 발생했습니다.");
        }
      } catch (err) {
        console.error("글 수정 에러:", err);
        alert("오류가 발생했습니다.");
      }
    });
  });
  