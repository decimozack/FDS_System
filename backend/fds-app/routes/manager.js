var express = require("express");
var router = express.Router();

/* Sample GET request from localhost:3001/sample/getUserList */
router.get("/getCustomerList", (req, res, next) => {
  var db = req.app.locals.db;

  db.query("SELECT * FROM Customers")
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

router.post("/retrieveCustomer", (req, res, next) => {
  var { id } = req.body;
  var db = req.app.locals.db;

  db.query("SELECT * FROM Customers WHERE (cid=$1)", [id])
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

router.post("/updateCustomer", (req, res, next) => {
  var { cid, email, firstName, lastName, creditCardInfo, password } = req.body;
  var db = req.app.locals.db;

  var queryStr =
    "UPDATE Customers SET c_first_name=$1, c_last_name=$2, email=$3, cpassword=$4, credit_card_info=$5" +
    "WHERE cid=$6";

  db.query(queryStr, [
    firstName,
    lastName,
    email,
    password,
    creditCardInfo,
    cid,
  ])
    .then(function (results) {
      res.status(201).send(`Customer updated`);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post("/EmpSignup", (req, res, next) => {
  var { email, firstName, lastName, workRole, password } = req.body;
  var db = req.app.locals.db;

  console.log(req.body);

  var queryStr =
    "INSERT INTO FDSEmployee(emptype, emp_first_name, emp_last_name, email, emppassword)" +
    "VALUES ($1,$2,$3,$4,$5)";

  // write a trigger/store procedure here
  // to insert a record into rider or manager
  // use trigger to check for logintable before inserting
  db.query(queryStr, [workRole, firstName, lastName, email, password])
    .then(function (results) {
      res.status(201).send(`Employee added`);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});
module.exports = router;
