const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

const protect = async (req, res, next) => {
  let token;

  // Expect token in Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await AdminUser.findById(decoded.id).select("-password");
      if (!req.admin) {
        return res.status(401).json({ message: "Not authorized" });
      }

      return next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  }

  return res.status(401).json({ message: "No token, not authorized" });
};

module.exports = { protect };
