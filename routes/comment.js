const express = require('express');
const Comment = require('../models/Comment');
const authenticate = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

/**
 * 댓글 등록 (로그인한 사용자만 가능)
 */
router.post('/posts/:postId/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    const newComment = new Comment({
      post: req.params.postId,
      author: req.user.id,
      content
    });

    await newComment.save();
    res.status(201).json({ message: '댓글이 등록되었습니다.', comment: newComment });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

/**
 * 댓글 수정 (본인 댓글만 가능)
 */
router.put('/comments/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '댓글 수정 권한이 없습니다.' });
    }

    comment.content = req.body.content;
    comment.updatedAt = new Date();

    await comment.save();
    res.json({ message: '댓글이 수정되었습니다.', comment });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

/**
 * 댓글 삭제 (본인 댓글만 가능)
 */
router.delete('/comments/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });

    const user = await User.findById(req.user.id).select('isAdmin');

    if (comment.author.toString() !== req.user.id && !user.isAdmin) {
      return res.status(403).json({ message: '댓글 삭제 권한이 없습니다.' });
    }

    await comment.deleteOne();
    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

module.exports = router;
