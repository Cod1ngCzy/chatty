import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevents XSS attacks
    sameSite: "lax", // Changed from "none" to "lax"
    secure: false, // OK for development HTTP
  });

  return token;
};