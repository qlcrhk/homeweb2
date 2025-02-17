const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',  // 토큰 유효기간 (7일)
  });
};

module.exports = generateToken;
