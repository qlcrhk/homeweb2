const express = require('express');
const Post = require('../models/Post');
const authenticate = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

/**
 * 게시글 등록 (로그인한 사용자만 가능)
 */
router.post('/posts', authenticate, async (req, res) => {
  try {
    const { title, content, images } = req.body;

    if (images && images.length > 4) {
      return res.status(400).json({ message: '이미지는 최대 4개까지 첨부할 수 있습니다.' });
    }

    const newPost = new Post({
      author: req.user.id,
      title,
      content,
      images
    });

    await newPost.save();
    res.status(201).json({ message: '게시글이 등록되었습니다.', post: newPost });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

/**
 * 게시글 목록 조회
 */
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'email').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

/**
 * 게시글 상세 조회
 */
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'email');
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

/**
 * 게시글 수정 (본인 작성글만 가능)
 */
router.put('/posts/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '게시글 수정 권한이 없습니다.' });
    }

    const { title, content, images } = req.body;
    if (images && images.length > 4) {
      return res.status(400).json({ message: '이미지는 최대 4개까지 첨부할 수 있습니다.' });
    }

    post.title = title;
    post.content = content;
    post.images = images;
    post.updatedAt = new Date();

    await post.save();
    res.json({ message: '게시글이 수정되었습니다.', post });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

/**
 * 게시글 삭제 (본인 작성글만 가능)
 */
router.delete('/posts/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    const user = await User.findById(req.user.id).select('isAdmin');

    if (comment.author.toString() !== req.user.id && !user.isAdmin) {
        return res.status(403).json({ message: '게시글 삭제 권한이 없습니다.' });
    }

    await post.deleteOne();
    res.json({ message: '게시글이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

module.exports = router;
