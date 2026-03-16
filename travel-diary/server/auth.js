const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'travel-diary-dev-secret-change-in-production';
const JWT_EXPIRY = '7d';

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken, JWT_SECRET };
