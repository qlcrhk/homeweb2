// models/Like.js
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  images: [String],
  location: String,
  likes: { type: Number, default: 0 },               // 좋아요 수
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // 좋아요한 사용자 목록
});

module.exports = mongoose.model('Like',likeSchema);
