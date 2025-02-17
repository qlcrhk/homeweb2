const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();

// ✅ 회원가입 (기본적으로 isAdmin = false 설정)
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
        }

        const newUser = new User({ name, email, password, isAdmin: false });
        await newUser.save();

        res.status(201).json({ message: "회원가입 성공!" });
    } catch (error) {
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

// ✅ 로그인 (isAdmin 값 포함하여 응답)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "잘못된 이메일 또는 비밀번호입니다." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "잘못된 이메일 또는 비밀번호입니다." });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // ✅ isAdmin 포함하여 응답
        res.json({ message: "로그인 성공", token, name: user.name, isAdmin: user.isAdmin });
    } catch (error) {
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

// ✅ 현재 로그인한 사용자 정보 가져오기
router.get("/me", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ name: user.name, email: user.email, isAdmin: user.isAdmin });
    } catch (error) {
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

module.exports = router;
