import createError from "http-errors";
import express from "express";
import path from "path";
import logger from "morgan";

import customer from "./routes/customer";
import sample from "./routes/sample";
import rider from "./routes/rider";
import manager from "./routes/manager";
import restaurant from "./routes/restaurant";

import config from "./config";
import cors from "cors";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "http://localhost:3000" }));

//Connect to Postgresql
var Pool = require("pg").Pool;
var pool = new Pool(config.DB_CONNECTION);
app.locals.db = pool;

// Backend Page Links
app.use("/sample", sample); //This means that all page directed to localhost:3001/sample/........ is redirected to sample.js
app.use("/customer", customer);
app.use("/rider", rider);
app.use("/manager", manager);
app.use("/restaurant", restaurant);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
