var express = require("express");
var router = express.Router();

/* Sample GET request from localhost:3001/sample/getUserList */
router.get("/getUserList", (req, res, next) => {
  var db = req.app.locals.db;

  db.query("SELECT * FROM LoginTable")
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error cannot find user list");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post("/verifyLogin", (req, res, next) => {
  var { email, password } = req.body;
  var db = req.app.locals.db;

  console.log(req.body);

  db.query("SELECT * FROM LoginTable WHERE (email=$1 AND upassword=$2)", [
    email,
    password,
  ])
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error cannot find user information");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post("/customerSignup", (req, res, next) => {
  var { email, firstName, lastName, creditCardInfo, password } = req.body;
  var db = req.app.locals.db;

  console.log(req.body);
  var datetime = new Date();

  var queryStr =
    "INSERT INTO Customers(c_first_name, c_last_name, email, cpassword, credit_card_info, reward_pts, created_on)" +
    "VALUES ($1,$2,$3,$4,$5,$6,$7)";

  db.query(queryStr, [
    firstName,
    lastName,
    email,
    password,
    creditCardInfo,
    0,
    datetime,
  ])
    .then(function (results) {
      res.status(201).send(`Customer added`);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

/* Sample Post request from localhost:3001/sample/addNewUser for creating a new user */
router.post("/addNewUser", (req, res, next) => {
  var { name, emql } = req.body;
  var db = req.app.locals.db;

  pool
    .query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email])
    .then(function (results) {
      res.status(201).send("User added with ID: ${result.insertId}");
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

module.exports = router;
