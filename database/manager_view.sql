DROP VIEW IF EXISTS LoginTable CASCADE;

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

