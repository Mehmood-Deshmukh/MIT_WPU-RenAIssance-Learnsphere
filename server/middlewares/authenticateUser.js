const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  var token = req.headers?.authorization; // Safely access the token

  if (!token) {
    return res.status(401).send("Access Denied: No Token Provided");
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied: Token Missing" });
    }

    jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
      if (err) {
        console.log(err?.message);
        return res.status(400).json({ message: err?.message });
      }
      req.user = decoded;
    });
    next();
  } catch (err) {
    console.log(err?.message);
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = authenticateUser;
