var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

router.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).redirect("/auth/login");
  }
  try {
    const decoded = jwt.verify(token, "sucsess");
    if (decoded.role !== "admin") {
      return res.status(403).send("Forbidden: Admins only");
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).redirect("/auth/login");
  }
});

module.exports = router;
