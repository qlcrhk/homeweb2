const express = require("express");
const router = express.Router();
const Community = require("../models/Community");

// 글쓰기 페이지 렌더링 (정적 HTML 파일 제공)
router.get("/new", (req, res) => {
  res.sendFile("community-new.html", { root: "./views" });
});

// 글 작성 처리 (POST 요청)
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    // 필수 필드 검증: 누락 시 400 에러 반환
    if (!title || !content || !author) {
      return res.status(400).json({ message: "모든 필드를 입력해 주세요." });
    }
    const newPost = new Community({ title, content, author });
    await newPost.save();
    // 글 작성 후 커뮤니티 목록 페이지로 리다이렉트 (또는 JSON 응답)
    res.redirect("/community");
  } catch (error) {
    console.error("커뮤니티 글 작성 오류:", error);
    // Mongoose ValidationError인 경우, 상세 에러 메시지 전송
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }
    res.status(500).json({ message: "서버 오류" });
  }
});

// 작성된 글 목록 조회
router.get("/", async (req, res) => {
  try {
    const posts = await Community.find().sort({ createdAt: -1 });
    // 템플릿 엔진 사용 시: res.render('community-list', { posts });
    res.json(posts);
  } catch (error) {
    console.error("커뮤니티 글 조회 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 글 상세 조회 (단일 글 조회)
router.get("/:id", async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "글을 찾을 수 없습니다." });
    }
    res.json(post);
  } catch (error) {
    console.error("글 상세 조회 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 글 수정 페이지 렌더링 (정적 HTML 파일 제공)
router.get("/:id/edit", async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "글을 찾을 수 없습니다." });
    }
    res.sendFile("community-edit.html", { root: "./views" });
  } catch (error) {
    console.error("글 수정 페이지 렌더링 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 글 수정 처리 (POST 요청)
router.post("/:id/edit", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ message: "모든 필드를 입력해 주세요." });
    }
    const updatedPost = await Community.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true, runValidators: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "글을 찾을 수 없습니다." });
    }
    res.redirect("/community");
  } catch (error) {
    console.error("글 수정 오류:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }
    res.status(500).json({ message: "서버 오류" });
  }
});

// 글 삭제 처리
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Community.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "글을 찾을 수 없습니다." });
    }
    res.json({ message: "글이 삭제되었습니다." });
  } catch (error) {
    console.error("글 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
