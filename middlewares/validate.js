const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || null;

module.exports = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token was provided" });
  } else {
    token = token.replace(/^Bearer\s+/, "");
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: err.message });
      next();
    });
  }
};
