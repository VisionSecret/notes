var express = require("express");
var router = express.Router();
const userModel = require("../Model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Route
router.get("/register", function (req, res, next) {
  if (req.cookies.token) {
    return res.redirect("/notes");
  }
  res.render("register");
});

router.post("/register", function (req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const err = new Error("All fields are required");
    err.statusCode = 400;
    return next(err);
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const newUser = await userModel.create({ name, email, password: hash });

      if (!newUser) {
        const err = new Error("Internal server error");
        err.statusCode = 500;
        return next(err);
      }

      const token = jwt.sign({ email: newUser.email, role: newUser.role }, "sucsess");
      res.cookie("token", token);
      res.redirect("/auth/login");
    });
  });
});

// Login Route

router.get("/login", function (req, res, next) {
  if (req.cookies.token) {
    return res.redirect("/notes");
  }

  res.render("login");
});

router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("All fields are required");
    err.statusCode = 400;
    return next(err);
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    return next(err);
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (!result) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      return next(err);
    }

    const token = jwt.sign({ email: user.email, role: user.role }, "sucsess");
    res.cookie("token", token);
    return res.redirect("/notes");
  });
});

module.exports = router;
