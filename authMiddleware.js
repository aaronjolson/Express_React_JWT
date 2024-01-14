const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./config');

const requiresAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = {
      username: decodedToken.username,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      console.error(error);
      return res.status(401).json({ message: "Failed to decode or verify token" });
    }
  }
};

module.exports = { requiresAuth };