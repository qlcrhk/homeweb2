const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  images: {
    type: [String], // 이미지 URL 목록
    validate: [arrayLimit, '이미지는 최대 4개까지 업로드할 수 있습니다.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 이미지 최대 4개 제한
function arrayLimit(val) {
  return val.length <= 4;
}

module.exports = mongoose.model('Property', propertySchema);
