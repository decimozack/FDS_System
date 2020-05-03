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
    "SELECT fid, rid, FI.catid, catname, FI.description, fname, price, food_limit, current_qty FROM FoodItem FI join Category C on FI.catid = C.catid where rid=$1",
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

router.post("/getOrders", (req, res, next) => {
  var db = req.app.locals.db;
  var { cid } = req.body;

  db.query("SELECT * FROM Orders WHERE cid=$1", [cid])
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error cannot find orders");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post("/test", (req, res, next) => {
  var db = req.app.locals.db;
  // var { cid } = req.body;

  var orderItems = [
    { a: "1", b: 2 },
    { a: "3", b: 4 },
  ];
  db.query("select * from testing($1)", [JSON.stringify(orderItems)])
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error cannot find orders");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err.message);
    });
});

router.post("/submitOrder", (req, res, next) => {
  var db = req.app.locals.db;
  var {
    userId,
    restaurantId,
    min_order_cost,
    orderItems,
    use_credit_card,
    use_points,
    price,
    delivery_fee,
    address,
    location_area,
    gain_reward_pts,
  } = req.body;

  price = parseFloat(price);
  min_order_cost = parseFloat(min_order_cost);
  use_credit_card = use_credit_card === "true";
  use_points = use_points === "true";
  var orderItemsString = JSON.stringify(orderItems);

  db.query("select submitOrder($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [
    userId,
    restaurantId,
    min_order_cost,
    use_credit_card,
    use_points,
    price,
    delivery_fee,
    address,
    location_area,
    gain_reward_pts,
    orderItemsString,
  ])
    .then(function (rows) {
      if (rows) {
        res.status(200).send(rows);
      } else {
        res.status(404).send("Error cannot find orders");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err.message);
    });
});

// router.post("/retrieveManager", (req, res, next) => {
//   var { id } = req.body;
//   var db = req.app.locals.db;

//   db.query("SELECT * FROM Manager NATURAL JOIN FDSEmployee WHERE (empid=$1)", [
//     id,
//   ])
//     .then(function (rows) {
//       if (rows) {
//         res.status(200).send(rows);
//       } else {
//         res.status(404).send("Error cannot find user information");
//       }
//     })
//     .catch(function (err) {
//       console.error(err);
//       res.status(500).send(err);
//     });
// });

module.exports = router;
