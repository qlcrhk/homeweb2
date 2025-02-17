const express = require("express");
const { authenticateUser, authorizeAdmin } = require("../middleware/auth");

const router = express.Router();

// ✅ 관리자만 접근 가능한 대시보드 API
router.get("/dashboard", authenticateUser, authorizeAdmin, (req, res) => {
    res.json({ message: "관리자 대시보드입니다.", user: req.user });
});

module.exports = router;
