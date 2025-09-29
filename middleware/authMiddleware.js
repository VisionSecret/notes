var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

router.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, "sucsess");
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect("/auth/login");
  }
});

module.exports = router;
