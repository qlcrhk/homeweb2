const express = require("express");
const Community = require("../models/Community");

const router = express.Router();

// ✅ 게시글 작성
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const post = new Community({ title, content, author });
    await post.save();
    res.status(201).json({ message: "✅ 게시글 작성 완료", post });
  } catch (err) {
    res.status(500).json({ message: "❌ 게시글 작성 실패", error: err.message });
  }
});

// ✅ 게시글 목록 조회
router.get("/", async (req, res) => {
  try {
    const posts = await Community.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "❌ 게시글 목록 조회 실패", error: err.message });
  }
});

// ✅ 개별 게시글 조회
router.get("/:id", async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "❌ 게시글을 찾을 수 없습니다." });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "❌ 게시글 조회 실패", error: err.message });
  }
});

// ✅ 게시글 수정
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Community.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!post) return res.status(404).json({ message: "❌ 게시글을 찾을 수 없습니다." });
    res.json({ message: "✅ 게시글 수정 완료", post });
  } catch (err) {
    res.status(500).json({ message: "❌ 게시글 수정 실패", error: err.message });
  }
});

// ✅ 게시글 삭제 (관리자만 가능)
router.delete("/:id", async (req, res) => {
  try {
    const { isAdmin } = req.body; // 요청에 관리자 여부 포함
    if (!isAdmin) return res.status(403).json({ message: "❌ 관리자만 삭제 가능합니다." });

    const post = await Community.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "❌ 게시글을 찾을 수 없습니다." });

    res.json({ message: "✅ 게시글 삭제 완료" });
  } catch (err) {
    res.status(500).json({ message: "❌ 게시글 삭제 실패", error: err.message });
  }
});

module.exports = router;
