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

router.get("/getRestaurantList", (req, res, next) => {
  var db = req.app.locals.db;

  db.query("SELECT * FROM Restaurants")
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error cannot find restaurant list");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/getRestaurant/:id", (req, res, next) => {
  var db = req.app.locals.db;
  const id = req.params.id;
  console.log(id);
  db.query("SELECT * FROM Restaurants where rid=$1", [id])
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error cannot find restaurant");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/getFoodItems/:id", (req, res, next) => {
  var db = req.app.locals.db;
  const id = req.params.id;

  db.query(
    "SELECT catname, FI.description, fname, price, food_limit, current_qty FROM FoodItem FI join Category C on FI.catid = C.catid where rid=$1",
    [id]
  )
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error cannot find restaurant");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

module.exports = router;
