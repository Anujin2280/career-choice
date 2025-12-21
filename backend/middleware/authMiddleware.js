import jwt from "jsonwebtoken";
import UserInfo from "../models/UserInfo.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserInfo.findById(decoded.id).select("-nuuts_ug");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  return res.status(401).json({ message: "Token not provided" });
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role_id !== 1) {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
};
