var express = require("express");
var router = express.Router();

/* Sample GET request from localhost:3001/sample/getUserList */
router.get("/getUserList", (req, res, next) => {
  var db = req.app.locals.db;

  db.query("SELECT * FROM workshift")
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
