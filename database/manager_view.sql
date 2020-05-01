DROP VIEW IF EXISTS LoginTable CASCADE;
DROP VIEW IF EXISTS TotalNewCustomerMonth CASCADE;
DROP VIEW IF EXISTS TotalOrderMonth CASCADE;
DROP VIEW IF EXISTS CustomerOrderSummary CASCADE;
DROP VIEW IF EXISTS DeliveryLocationSummary CASCADE;
DROP VIEW IF EXISTS RiderPartSummary CASCADE;
DROP VIEW IF EXISTS RiderSummary CASCADE;

/* 
Login Table with all the information from all the tables
*/
create view LoginTable (userid, email, upassword, usertype) as
select distinct cid, email, cpassword, 'c' from customers
union
select distinct rsid, email, rspassword, 'r' from restaurantstaff
union
select distinct empid, email, emppassword, 'm' from Manager natural join FDSEmployee
union
select distinct empid, email, emppassword, 'ri' from Rider natural join FDSEmployee
;

-- create view ManagerSummaryOne (num_customer, num_order, total_cost_order) as
create view TotalNewCustomerMonth as
select date_part('year',C1.created_on) as t_year, date_part('month',C1.created_on) as t_month, count(*) as customerCount
from Customers C1 
group by date_part('year',C1.created_on), date_part('month',C1.created_on);

create view TotalOrderMonth as
select date_part('year',O1.order_time) as t_year, date_part('month',O1.order_time) as t_month, count(*) as orderCount, sum(price) as totalPrice 
from Orders O1
where O1.order_status =  'COMPLETED'
group by date_part('year',O1.order_time), date_part('month',O1.order_time);


-- Manager Summary Two
create view CustomerOrderSummary as
select O1.cid, date_part('year',O1.order_time) as t_year,
date_part('month',O1.order_time) as t_month,
count(*) as orderCount, sum(price) as totalPrice  
from Orders O1
where O1.order_status = 'COMPLETED'
group by O1.cid, date_part('year',O1.order_time),
date_part('month',O1.order_time);


-- Manager Summary Three
create view DeliveryLocationSummary as
select date_part('year',O1.order_time) as t_year,
date_part('month',O1.order_time) as t_month,
date_part('day',O1.order_time) as t_day,
date_part('hour',O1.order_time) as t_hour,
O1.location_area,
count(*) as orderCount
from Orders O1
where O1.order_status = 'COMPLETED'
group by date_part('year',O1.order_time),
date_part('month',O1.order_time),
date_part('day',O1.order_time),
date_part('hour',O1.order_time),
O1.location_area;


-- Manager Summary 4
create view RiderPartSummary as
select date_part('year', A1.toRestaurantTime) as t_year,
date_part('month', A1.toRestaurantTime) as t_month,
A1.empid,
count(A1.oid) as deliveryOrderCount,
avg(A1.arriveAtCustomerTime - A1.toRestaurantTime) as avgDeliveryTime,
count(RR.rating) as ratingCount,
coalesce(avg(RR.rating),0) as avgRating
FROM Assigned A1
left join RiderRatings RR on RR.oid = A1.oid
group by date_part('year', A1.toRestaurantTime),
date_part('month', A1.toRestaurantTime),
A1.empid; 

create view RiderSummary as
select RPS.t_year,
RPS.t_month,
RPS.empid,
RPS.deliveryOrderCount,
S1.total_hours as totalHours,
S1.salary as totalSalarys,
RPS.avgDeliveryTime ,
RPS.ratingCount,
RPS.avgRating
FROM RiderPartSummary RPS left join Salary S1 on RPS.empid = S1.empid and 
RPS.t_month = extract(MONTH FROM S1.month) and
RPS.t_year = extract(YEAR FROM S1.month);
