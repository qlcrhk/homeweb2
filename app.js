require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ✅ 모델 불러오기
const Property = require("./models/Property");

// ✅ 라우트 불러오기
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const communityRoutes = require("./routes/communityRoutes"); // 커뮤니티 라우트 추가

const app = express();

// ✅ 보안 설정
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "https://dapi.kakao.com", "https://t1.daumcdn.net"],
        "img-src": [
          "'self'", "data:", "https://t1.daumcdn.net", "https://mts.daumcdn.net",
          "https://s1.daumcdn.net", "https://images.pexels.com"
        ],
      },
    },
  })
);

// ✅ API 요청 속도 제한
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: "⚠️ 너무 많은 요청을 보냈습니다. 잠시 후 다시 시도하세요.",
});
app.use(limiter);

// ✅ MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB 연결 완료"))
  .catch((err) => console.error("❌ MongoDB 연결 실패", err));

// ✅ 미들웨어 설정
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ✅ HTML 파일 제공
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "index.html")));

const pages = ["login", "signup", "property-upload", "property-search", "question", "community", "community-write", "community-detail"];
pages.forEach((page) => {
  app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, "views", `${page}.html`)));
});

// ✅ Kakao API Key 제공
app.get("/api/kakao-key", (req, res) => {
  res.json({ key: process.env.KAKAO_JS_API });
});

// ✅ 매물 검색 API
app.get("/api/properties/search", async (req, res) => {
  const { propertyType } = req.query;
  const filter = propertyType && propertyType !== "all" ? { propertyType } : {};
  const properties = await Property.find(filter);
  res.json(properties);
});

// ✅ API 라우트 설정
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/community", communityRoutes); // 커뮤니티 API 추가

// ✅ 404 처리
app.use((req, res) => res.status(404).json({ message: "❌ 페이지를 찾을 수 없습니다." }));

// ✅ 글로벌 에러 핸들링
app.use((err, req, res, next) => {
  console.error("🔥 서버 오류:", err);
  res.status(500).json({ message: "🚨 서버 오류 발생", error: err.message });
});

// ✅ 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 서버 실행: http://localhost:${PORT}`));
