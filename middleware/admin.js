// 관리자 확인 미들웨어

const adminCheck = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    }
    next();
  };
  
  module.exports = adminCheck;
  