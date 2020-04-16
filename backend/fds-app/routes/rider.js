var express = require('express');
var router = express.Router();

function workshift_to_array (workshift) {
  var res = []
  if (!workshift) {
    return {
      h1:false,
      h2:false,
      h3:false,
      h4:false,
      h5:false,
      h6:false,
      h7:false,
      h8:false,
      h9:false,
      h0:false,
      h11:false,
      h12:false,
    }
  }
  
  return workshift
}

/* Sample GET request from localhost:3001/sample/getUserList */
router.get('/getRiderWWS/:id', (req, res, next) => {
  var db = req.app.locals.db;

  var riderid = req.params.id;
  
  db.query('SELECT * FROM WWS WHERE empid = $1', [riderid])
  .then(results => {
    var rows = results.rows
    if (!rows || !rows.length) {
      res.status(200).send([])
    } else {
      var wws = rows[0];
      var fullWWS = {};
      var sql = 'SELECT h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12 from WorkShift where wsid = $1';
      db.query(sql, [wws.monday])
      .then(results => {
        fullWWS.monday = workshift_to_array(results.rows[0]);
        return db.query(sql, [wws.tuesday])
      })
      .then(results => {
        fullWWS.tuesday = workshift_to_array(results.rows[0]);
        return db.query(sql, [wws.wednesday])
      })
      .then(results => {
        fullWWS.wednesday = workshift_to_array(results.rows[0]);
        return db.query(sql, [wws.thursday])
      })
      .then(results => {
        fullWWS.thursday = workshift_to_array(results.rows[0]);
        return db.query(sql, [wws.friday])
      })
      .then(results => {
        fullWWS.friday = workshift_to_array(results.rows[0]);
        return db.query(sql, [wws.saturday])
      })
      .then(results => {
        fullWWS.saturday = workshift_to_array(results.rows[0]);
        return db.query(sql, [wws.sunday])
      })
      .then(results => {
        fullWWS.sunday = workshift_to_array(results.rows[0]);
        res.status(200).send([fullWWS])
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  })

});

function workshift_to_sql(workshift) {
  var ret = [];
  for (var i = 1; i <= 12; i++) {
    var s = "";
    s += "h"+i+"=";
    s += workshift['h'+i] ? 'true' : 'false';
    ret.push(s)
  }
  var f = ret.join(' and ');
  return f;
}

function workshift_to_insert_sql(workshift) {
  var ret = [];
  for (var i = 1; i <= 12; i++) {
    var s = workshift['h'+i] ? 'true' : 'false';
    ret.push(s)
  }
  var f = "(" + ret.join(',') + ")";
  return f;
}

router.post('/updateRiderWWS', (req, res, next) => {
  var db = req.app.locals.db;
  var {id, shift} = req.body;

  console.log(workshift_to_sql(shift.monday));
  console.log(workshift_to_insert_sql(shift.monday));
  var WWS = {empid: id};

  var sql = 'insert into workshift (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) values '+workshift_to_insert_sql(shift.monday)+
          ' ON conflict (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) do nothing;\
          select wsid from workshift where '+workshift_to_sql(shift.monday)+';'
  db.query(sql)
  .then(response => {
    var wsid = response[1].rows[0].wsid;
    WWS['monday'] = wsid;

    var sql = 'insert into workshift (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) values '+workshift_to_insert_sql(shift.tuesday)+
          ' ON conflict (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) do nothing;\
          select wsid from workshift where '+workshift_to_sql(shift.tuesday)+';'
    return db.query(sql);
  })
  .then(response => {
    var wsid = response[1].rows[0].wsid;
    WWS['tuesday'] = wsid;

    var sql = 'insert into workshift (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) values '+workshift_to_insert_sql(shift.wednesday)+
          ' ON conflict (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) do nothing;\
          select wsid from workshift where '+workshift_to_sql(shift.wednesday)+';'
    return db.query(sql);
  })
  .then(response => {
    var wsid = response[1].rows[0].wsid;
    WWS['wednesday'] = wsid;

    var sql = 'insert into workshift (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) values '+workshift_to_insert_sql(shift.thursday)+
          ' ON conflict (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) do nothing;\
          select wsid from workshift where '+workshift_to_sql(shift.thursday)+';'
    return db.query(sql);
  })
  .then(response => {
    var wsid = response[1].rows[0].wsid;
    WWS['thursday'] = wsid;

    var sql = 'insert into workshift (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) values '+workshift_to_insert_sql(shift.friday)+
          ' ON conflict (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) do nothing;\
          select wsid from workshift where '+workshift_to_sql(shift.friday)+';'
    return db.query(sql);
  })
  .then(response => {
    var wsid = response[1].rows[0].wsid;
    WWS['friday'] = wsid;

    var sql = 'insert into workshift (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) values '+workshift_to_insert_sql(shift.saturday)+
          ' ON conflict (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) do nothing;\
          select wsid from workshift where '+workshift_to_sql(shift.saturday)+';'
    return db.query(sql);
  })
  .then(response => {
    var wsid = response[1].rows[0].wsid;
    WWS['saturday'] = wsid;

    var sql = 'insert into workshift (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) values '+workshift_to_insert_sql(shift.sunday)+
          ' ON conflict (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12) do nothing;\
          select wsid from workshift where '+workshift_to_sql(shift.sunday)+';'
    return db.query(sql);
  })
  .then(response => {
    var wsid = response[1].rows[0].wsid;
    WWS['sunday'] = wsid;

    var sql = 'update wws set monday='+WWS.monday+',tuesday='+WWS.tuesday+',wednesday='+WWS.wednesday+',thursday='+WWS.thursday+',friday='+WWS.friday+',saturday='+WWS.saturday+',sunday='+WWS.sunday+
              'where empid ='+WWS.empid+';';
    return db.query(sql);
  })
  .then(response => {
    res.status(200).send("Successfully updated Workshift");
  })
  .catch(err => {
    console.log(err)
    res.status(500).send("Failed to update WorkShift, Invalid WorkShift");
  })

});

router.get('/getClockIn/:id', (req, res, next) => {
  var db = req.app.locals.db;

  var riderid = req.params.id;
  
  db.query('SELECT timeIn::timestamp, timeOut::timestamp FROM ClockIn WHERE empid = $1 order by timeIn desc', [riderid])
  .then(results => {
    var rows = results.rows
    console.log(rows);
    res.status(200).send(rows);
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  })

});

router.get('/clockIn/:id', (req, res, next) => {
  var db = req.app.locals.db;

  var riderid = req.params.id;
  
  db.query('INSERT INTO ClockIn (empid, timein) values ($1, now())', [riderid])
  .then(results => {
    var rows = results.rows
    console.log(rows);
    res.status(200).send(rows);
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  })

});

router.get('/clockOut/:id', (req, res, next) => {
  var db = req.app.locals.db;

  var riderid = req.params.id;
  
  db.query('UPDATE ClockIn SET timeout=now() where empid=$1 and timeout is null', [riderid])
  .then(results => {
    var rows = results.rows
    console.log(rows);
    res.status(200).send(rows);
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  })

});

router.get('/getAssignedOrders/:id', (req, res, next) => {
  var db = req.app.locals.db;

  var riderid = req.params.id;
  
  db.query('SELECT oid, toRestaurantTime, arriveAtRestaurantTime, restaurantToCustomerTime, arriveAtCustomerTime, commission\
   FROM Assigned WHERE empid = $1 order by oid desc', [riderid])
  .then(results => {
    var rows = results.rows
    console.log(rows);
    res.status(200).send(rows);
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  })

});


router.post('/updateOrderTime', (req, res, next) => {
  var db = req.app.locals.db;
  var {empid, oid, col} = req.body;

  db.query('UPDATE Assigned SET '+col+' = now() where oid = '+oid+' and '+col+' is null')
  .then(response => {
    console.log(response)
    res.status(200).send(response)
  })
  .catch(err => {
    console.log(err)
    res.status(500).send("Failed to update assigned order info");
  })

});

router.get('/getSalary/:id', (req, res, next) => {
  var db = req.app.locals.db;

  var riderid = req.params.id;
  
  db.query('SELECT month::text, salary from Salary WHERE empid=$1;', [riderid])
  .then(results => {
    var rows = results.rows
    console.log(rows);
    res.status(200).send(rows);
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  })

});

module.exports = router;