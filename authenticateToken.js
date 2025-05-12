import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid or expired token" });
    }
    // assume payload contains { userId: number }
    req.userId = (payload as any).userId;
    next();
  });
};
