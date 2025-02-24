/* global fetch */
document.addEventListener("DOMContentLoaded", async () => {
    const postsUl = document.getElementById("posts");
    const noPostsP = document.getElementById("no-posts");
  
    try {
      // API를 통해 커뮤니티 글 목록을 가져옵니다.
      const response = await fetch("/api/community");
      if (!response.ok) {
        throw new Error("게시글을 불러오는데 실패했습니다.");
      }
      const posts = await response.json();
  
      // 게시글이 없으면 안내 메시지를 표시합니다.
      if (posts.length === 0) {
        noPostsP.style.display = "block";
      } else {
        noPostsP.style.display = "none";
        posts.forEach(post => {
          const li = document.createElement("li");
          li.innerHTML = `
            <div>
              <strong>${post.title}</strong> <span>by ${post.author}</span>
            </div>
            <div>
              <button class="edit-btn" data-id="${post._id}">수정</button>
              <button class="delete-btn" data-id="${post._id}">삭제</button>
            </div>
          `;
          postsUl.appendChild(li);
        });
  
        // 수정 버튼: 클릭 시 해당 글 수정 페이지로 이동 (/community/{id}/edit)
        document.querySelectorAll(".edit-btn").forEach(button => {
          button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            window.location.href = `/community/${id}/edit`;
          });
        });
  
        // 삭제 버튼: 클릭 시 DELETE 요청을 보내고 목록에서 제거
        document.querySelectorAll(".delete-btn").forEach(button => {
          button.addEventListener("click", async () => {
            const id = button.getAttribute("data-id");
            if (confirm("정말로 이 글을 삭제하시겠습니까?")) {
              try {
                const deleteResponse = await fetch(`/api/community/${id}`, {
                  method: "DELETE"
                });
                if (!deleteResponse.ok) {
                  throw new Error("삭제에 실패했습니다.");
                }
                alert("글이 삭제되었습니다.");
                // 삭제 후 해당 li 요소 제거
                button.parentElement.parentElement.remove();
                // 게시글이 없으면 안내 메시지 표시
                if (postsUl.children.length === 0) {
                  noPostsP.style.display = "block";
                }
              } catch (error) {
                console.error("삭제 에러:", error);
                alert("글 삭제 중 오류가 발생했습니다.");
              }
            }
          });
        });
      }
    } catch (error) {
      console.error("게시글 로딩 에러:", error);
      noPostsP.style.display = "block";
      noPostsP.textContent = "게시글을 불러오는데 오류가 발생했습니다.";
    }
  });
  