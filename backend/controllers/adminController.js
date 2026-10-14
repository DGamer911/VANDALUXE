
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD_HASH ||
      !process.env.JWT_SECRET
    ) {
      return res.status(500).json({
        error: "Admin authentication is not configured",
      });
    }

    const emailMatches =
      email.trim().toLowerCase() ===
      process.env.ADMIN_EMAIL.trim().toLowerCase();

    const passwordMatches = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      error: "Unable to log in",
    });
  }
};
    