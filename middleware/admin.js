const authenticate = require("./auth");

const adminOnly = (req, res, next) => {
  authenticate(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "관리자 권한이 필요합니다." });
    }
    next();
  });
};

module.exports = adminOnly;
