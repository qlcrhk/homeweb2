document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('postForm');
  
  form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
          title: document.getElementById('title').value.trim(),
          content: document.getElementById('content').value.trim()
      };
      
      // Validate form data
      if (!formData.title || !formData.content) {
          alert('제목과 내용을 입력해주세요.');
          return;
      }
      
      try {
          // Send POST request to server
          const response = await fetch('/api/community', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
          });
          
          if (!response.ok) {
              throw new Error('서버 오류가 발생했습니다.');
          }
          
          const result = await response.json();
          
          // Ensure redirection happens regardless of the response
          alert(result.success ? '글이 성공적으로 등록되었습니다.' : (result.message || '글 등록에 실패했습니다.'));
          window.location.href = '/community'; // Redirect to community list page
      } catch (error) {
          console.error('Error:', error);
          alert('글 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
          window.location.href = '/community'; // Redirect even if there's an error
      }
  });
  
  // Add input validation and character count (optional)
  const titleInput = document.getElementById('title');
  const contentTextarea = document.getElementById('content');
  
  titleInput.addEventListener('input', function() {
      if (this.value.length > 100) {
          this.value = this.value.substring(0, 100);
          alert('제목은 100자를 초과할 수 없습니다.');
      }
  });
  
  contentTextarea.addEventListener('input', function() {
      if (this.value.length > 2000) {
          this.value = this.value.substring(0, 2000);
          alert('내용은 2000자를 초과할 수 없습니다.');
      }
  });
  
  // Handle post deletion
  const postList = document.getElementById("postList");
  postList.addEventListener("click", function (event) {
      if (event.target.classList.contains("delete-btn")) {
          event.target.parentElement.remove();
      }
  });
});
