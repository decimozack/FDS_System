var express = require("express");
var router = express.Router();

router.get("/getRestaurantInfo/:id", (req, res, next) => {
  var db = req.app.locals.db;

  var rsid = req.params.id;
  console.log(rsid);

  db.query(
    "SELECT R.rid, rname, min_order_cost from Restaurants R, RestaurantStaff RS where RS.rsid=$1 and RS.rid=R.rid limit 1;",
    [rsid]
  )
    .then((results) => {
      var rows = results.rows;
      console.log(rows);
      res.status(200).send(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.get("/getMenu/:rid", (req, res, next) => {
  var db = req.app.locals.db;

  var rid = req.params.rid;
  console.log(rid);

  var sql =
    "SELECT F.fid, F.fname, F.description as fdesc, C.catname, C.description as cdesc, F.food_limit, F.current_qty, F.price \
  					From FoodItem F, Category C \
  					Where F.catid=C.catid and F.rid=$1 order by F.fid asc";

  db.query(sql, [rid])
    .then((results) => {
      var rows = results.rows;
      console.log(rows);
      res.status(200).send(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.get("/getDiscountPromo/:rid", (req, res, next) => {
  var db = req.app.locals.db;

  var rid = req.params.rid;
  console.log(rid);

  var sql =
    "SELECT pcid, start_time::date, end_time::date, min_spend, max_spend, discount \
  					From PromoCampaign natural join PromoByRestaurant natural join DiscountPromo \
  					Where rid=$1";

  db.query(sql, [rid])
    .then((results) => {
      var rows = results.rows;
      console.log(rows);
      res.status(200).send(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.get("/getReview/:rid", (req, res, next) => {
  var db = req.app.locals.db;

  var rid = req.params.rid;
  console.log(rid);

  var sql =
    "SELECT oid, description \
  					From RestaurantReview natural join Orders \
  					Where rid=$1";

  db.query(sql, [rid])
    .then((results) => {
      var rows = results.rows;
      console.log(rows);
      res.status(200).send(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/updateFoodItem", (req, res, next) => {
  var db = req.app.locals.db;
  var { fid, fname, fdesc, catname, food_limit, price } = req.body;

  db.query("SELECT catid from Category where catname=$1", [catname])
    .then((results) => {
      if (results.rows.length == 1) {
        var catid = results.rows[0].catid;
        var sql =
          "UPDATE FoodItem SET fname='" +
          fname +
          "', description='" +
          fdesc +
          "', food_limit=" +
          food_limit +
          ", price=" +
          price +
          ",catid=" +
          catid +
          " where fid=" +
          fid +
          ";";
        db.query(sql)
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update Food Item");
          });
      } else {
        res.status(500).send("Failed to find category");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to update Food Item");
    });
});

router.post("/updateMinOrderCost", (req, res, next) => {
  var db = req.app.locals.db;
  var { min_order_cost, rid } = req.body;

  db.query(
    "UPDATE Restaurants SET min_order_cost=" +
      min_order_cost +
      " where rid=" +
      rid +
      ";"
  )
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to update Food Item");
    });
});

router.post("/newFoodItem", (req, res, next) => {
  var db = req.app.locals.db;
  var { fname, fdesc, catname, food_limit, price, rid } = req.body;

  db.query("SELECT catid from Category where catname=$1", [catname])
    .then((results) => {
      if (results.rows.length == 1) {
        var catid = results.rows[0].catid;
        var sql =
          "INSERT INTO FoodItem (rid, fname, description, catid, food_limit,current_qty, price) values (" +
          rid +
          ", '" +
          fname +
          "', '" +
          fdesc +
          "', " +
          catid +
          ", " +
          food_limit +
          ", " +
          price +
          ");";
        console.log(sql);
        db.query(sql)
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update Food Item");
          });
      } else {
        res.status(500).send("Failed to find category");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to update Food Item");
    });
});

router.post("/newDiscountPromo", (req, res, next) => {
  var db = req.app.locals.db;
  var { rid, start_time, end_time, min_spend, max_spend, discount } = req.body;

  var sql =
    "begin;\
  					Insert into PromoCampaign (campaign_type, start_time, end_time) values ('DiscountPromo', '" +
    start_time +
    "', '" +
    end_time +
    "');\
  					Insert into PromoByRestaurant (pcid, rid) (SELECT pcid, " +
    rid +
    " from PromoCampaign order by pcid desc limit 1);\
  					Insert into DiscountPromo (pcid, min_spend, max_spend, discount) (SELECT pcid, " +
    min_spend +
    ", " +
    max_spend +
    ", " +
    discount +
    " from PromoCampaign order by pcid desc limit 1);\
  					commit;";
  console.log(sql);
  db.query(sql)
    .then((results) => {
      res.status(200).send("Successfully Inserted");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to update Food Item");
    });
});

module.exports = router;
