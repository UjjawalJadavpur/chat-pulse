
const jwt = require('jsonwebtoken');

console.log('JWT Secret:', process.env.JWT_SECRET);


const generateToken = (userId ) => {

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10h' });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

module.exports = { generateToken, verifyToken };
