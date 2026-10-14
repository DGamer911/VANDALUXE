
import jwt from "jsonwebtoken";

const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Admin authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired admin token",
    });
  }
};

export default protectAdmin;
