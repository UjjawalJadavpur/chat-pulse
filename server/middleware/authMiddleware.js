const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = async (req, res, next) => {
  // Get token from the request header
  const token = req.headers.authorization?.split(' ')[1]; // The token format is usually 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  try {
    // Verify the token
    const decoded = await verifyToken(token);
    req.user = decoded; // Attach decoded user to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
