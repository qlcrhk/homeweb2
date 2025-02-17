const CommunityPost = require("../models/CommunityPost");
const Comment = require("../models/Comment");

// 게시글 목록 조회
exports.getPosts = async (req, res) => {
    const posts = await CommunityPost.find();
    res.json(posts);
};

// 게시글 상세 조회
exports.getPostById = async (req, res) => {
    const post = await CommunityPost.findById(req.params.id);
    res.json(post);
};

// 게시글 작성
exports.createPost = async (req, res) => {
    const { title, content, author } = req.body;
    const newPost = new CommunityPost({ title, content, author });
    await newPost.save();
    res.json({ message: "게시글이 등록되었습니다." });
};

// 게시글 수정
exports.updatePost = async (req, res) => {
    const { title, content } = req.body;
    await CommunityPost.findByIdAndUpdate(req.params.id, { title, content });
    res.json({ message: "게시글이 수정되었습니다." });
};

// 게시글 삭제 (관리자 또는 작성자)
exports.deletePost = async (req, res) => {
    await CommunityPost.findByIdAndDelete(req.params.id);
    res.json({ message: "게시글이 삭제되었습니다." });
};

// 댓글 목록 조회
exports.getComments = async (req, res) => {
    const comments = await Comment.find({ postId: req.params.id });
    res.json(comments);
};

// 댓글 작성
exports.createComment = async (req, res) => {
    const { author, content } = req.body;
    const newComment = new Comment({ postId: req.params.id, author, content });
    await newComment.save();
    res.json({ message: "댓글이 등록되었습니다." });
};
