var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var authMiddlewareRouter = require("./middleware/authMiddleware");
var adminMiddlewareRouter = require("./middleware/adminMiddleware");
const ConnectDB = require("./Config/db");

var app = express();

ConnectDB();

app.use(logger("dev"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use(authMiddlewareRouter);
app.use(adminMiddlewareRouter);

// error middleware (in app.js, after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack); // log error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

module.exports = app;
