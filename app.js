const express = require('express');
const mongoose = require('mongoose');
const path = require('path');  // path 모듈 추가
require('dotenv').config();

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/property');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error(err));

// 라우터 연결
app.use('/api', authRoutes);
app.use('/api', propertyRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

// 메인 페이지 라우팅 (views 폴더)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));  // views 폴더로 경로 수정
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'product.html'));  // views 폴더로 경로 수정
});

// 지도 페이지 라우팅
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'map.html'));  // 지도 페이지 추가
});
// 상세 페이지 라우팅
app.get('/detail', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'productDetail.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 http://localhost:${PORT} 에서 실행 중`));
