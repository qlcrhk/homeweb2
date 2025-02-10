// 게시글 미들웨어

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    validate: [arrayLimit, '이미지는 최대 4개까지 첨부할 수 있습니다.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// 이미지 첨부 최대 4개 제한
function arrayLimit(val) {
  return val.length <= 4;
}

module.exports = mongoose.model('Post', postSchema);
