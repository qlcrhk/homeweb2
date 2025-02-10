const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const { authenticateUser } = require('../middleware/auth');

// 좋아요/취소 기능
router.post('/:id/like', authenticateUser, async (req, res) => {
  try {
    const like = await Like.findById(req.params.id);
    const userId = req.user.id;

    if (!like) return res.status(404).json({ message: '매물을 찾을 수 없습니다.' });
    if (!userId) return res.status(401).json({ message: '인증이 필요합니다.' });

    const likedUsers = new Set(like.likedBy.map(id => id.toString()));

    if (likedUsers.has(userId)) {
      // 좋아요 취소
      like.likedBy.pull(userId);
      like.likes = Math.max(like.likes - 1, 0); // 음수 방지
    } else {
      // 좋아요 추가
      like.likedBy.push(userId);
      like.likes += 1;
    }

    await listing.save();
    res.json({ likes: like.likes, liked: like.likedBy.includes(userId) });
  } catch (error) {
    console.error('좋아요 처리 중 오류:', error);
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
});

module.exports = router;
