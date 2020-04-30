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

router.get("/getRiderSummaryOverall", (req, res, next) => {
  var db = req.app.locals.db;

  db.query("SELECT * FROM RiderSummary")
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error find RiderOverallSummary");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post("/getRiderSummary", (req, res, next) => {
  var { id, year, month } = req.body;
  var db = req.app.locals.db;

  db.query(
    "SELECT * FROM RiderSummary WHERE empid=$1 and t_year=$2 and t_month=$3",
    [id, year, month]
  )
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error find RiderOverallSummary");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/getDeliveryLocationSummaryOverall", (req, res, next) => {
  var db = req.app.locals.db;

  db.query("SELECT * FROM DeliveryLocationSummary")
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error find DeliveryLocationSummary");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post("/getDeliveryLocationSummary", (req, res, next) => {
  var { year, month, day, hour, area } = req.body;
  var db = req.app.locals.db;

  db.query(
    "SELECT * FROM DeliveryLocationSummary WHERE t_year=$1 and t_month=$2 and t_month=$3 and t_day=$3 and t_hour=$4 and location_area=$5",
    [year, month, day, hour, area]
  )
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error find DeliveryLocationSummary");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/getCustomerOrderSummaryOverall", (req, res, next) => {
  var db = req.app.locals.db;

  db.query("SELECT * FROM CustomerOrderSummary")
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error find CustomerOrderSummary");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

// router.post("/getCustomerOrderSummary", (req, res, next) => {
//   var { id, year, month } = req.body;
//   var db = req.app.locals.db;

//   db.query(
//     "SELECT * FROM CustomerOrderSummary WHERE t_year=$1 and t_month=$2 and cid=$3",
//     [year, month, id]
//   )
//     .then(function (rows) {
//       if (rows) {
//         res.status(200).send(rows);
//       } else {
//         res.status(404).send("Error find CustomerOrderSummary");
//       }
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send(err);
//     });
// });

router.get("/getCustomerOrderSummaryOverall", (req, res, next) => {
  var db = req.app.locals.db;

  db.query("SELECT * FROM CustomerOrderSummary")
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error find CustomerOrderSummary");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post("/getCustomerOrderSummary", (req, res, next) => {
  var { id, year, month } = req.body;
  var db = req.app.locals.db;

  db.query(
    "SELECT * FROM CustomerOrderSummary WHERE t_year=$1 and t_month=$2 and cid=$3",
    [year, month, id]
  )
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error find CustomerOrderSummary");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post("/getMonthlySummary", (req, res, next) => {
  var { year, month } = req.body;
  var db = req.app.locals.db;

  db.query("SELECT * FROM getmonthsummary($1,$2)", [year, month])
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error find MonthlySummary");
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

router.post("/retrieveManager", (req, res, next) => {
  var { id } = req.body;
  var db = req.app.locals.db;

  db.query("SELECT * FROM Manager NATURAL JOIN FDSEmployee WHERE (empid=$1)", [
    id,
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

router.post("/retrieveRider", (req, res, next) => {
  var { id } = req.body;
  var db = req.app.locals.db;

  db.query("SELECT * FROM Rider NATURAL JOIN FDSEmployee WHERE (empid=$1)", [
    id,
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

router.post("/updateRider", (req, res, next) => {
  var { empid, email, firstName, lastName, isPartTime, password } = req.body;
  var db = req.app.locals.db;

  var queryStr = "select updateRider($1,$2,$3,$4,$5,$6)";

  db.query(queryStr, [email, firstName, lastName, password, empid, isPartTime])
    .then(function (results) {
      res.status(201).send(`Rider updated`);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post("/updateManager", (req, res, next) => {
  var { empid, email, firstName, lastName, password } = req.body;
  var db = req.app.locals.db;

  var queryStr =
    "UPDATE FDSEmployee SET emp_first_name=$1, emp_last_name=$2, email=$3, emppassword=$4 " +
    "WHERE empid=$5";

  db.query(queryStr, [firstName, lastName, email, password, empid])
    .then(function (results) {
      res.status(201).send(`Manager updated`);
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
