const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) return res.status(401).json({ message: "로그인이 필요합니다." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // ✅ 비밀번호 제외
        next();
    } catch (error) {
        res.status(401).json({ message: "인증 실패" });
    }
};

module.exports = { authenticateUser };
