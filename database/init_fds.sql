DROP TABLE IF EXISTS RestaurantStaff CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS Sells CASCADE;
DROP TABLE IF EXISTS Menu CASCADE;
DROP TABLE IF EXISTS FoodItem CASCADE;
DROP TABLE IF EXISTS Category CASCADE;
DROP TABLE IF EXISTS OrderItem CASCADE;
DROP TABLE IF EXISTS Place CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS RestaurantReview CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Salary CASCADE;
DROP TABLE IF EXISTS Belongs CASCADE;
DROP TABLE IF EXISTS PromoCampaign CASCADE;
DROP TABLE IF EXISTS PromoByRestaurant CASCADE;
DROP TABLE IF EXISTS PromoBFDS CASCADE;
DROP TABLE IF EXISTS DiscountPromo CASCADE;
DROP TABLE IF EXISTS Uses CASCADE;
DROP TABLE IF EXISTS OrderPromoCampaignUsage CASCADE;
DROP TABLE IF EXISTS Eligible CASCADE;
DROP TABLE IF EXISTS FDSEmployee CASCADE;
DROP TABLE IF EXISTS Rider CASCADE;
DROP TABLE IF EXISTS WWS CASCADE;
DROP TABLE IF EXISTS OrderWaitingList CASCADE;
DROP TABLE IF EXISTS WorkShift CASCADE;
DROP TABLE IF EXISTS RiderRatings CASCADE;
DROP TABLE IF EXISTS Assigned CASCADE;
DROP TABLE IF EXISTS ClockIn CASCADE;
DROP TABLE IF EXISTS Manager CASCADE;
DROP TABLE IF EXISTS PointUsage CASCADE;
DROP TABLE IF EXISTS LocationArea CASCADE;
DROP TYPE IF EXISTS ostatus CASCADE;
DROP TYPE IF EXISTS campaignEnum CASCADE;
DROP TYPE IF EXISTS emp_type CASCADE;

CREATE TABLE Restaurants (
	rid SERIAL PRIMARY KEY,
	rname VARCHAR(50) NOT NULL,
	min_order_cost DECIMAL(5, 2) NOT NULL
);

CREATE TABLE RestaurantStaff (
	rsid SERIAL PRIMARY KEY,
	rs_first_name VARCHAR(50) NOT NULL,
	rs_last_name VARCHAR(50) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	rspassword VARCHAR(50) NOT NULL,
	rid INTEGER NOT NULL,
	FOREIGN KEY (rid) REFERENCES Restaurants
);

CREATE TABLE Customers (
	cid SERIAL PRIMARY KEY,
	c_first_name VARCHAR(50) NOT NULL,
	c_last_name VARCHAR(50) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	cpassword VARCHAR(50),
	credit_card_info VARCHAR(50),
	reward_pts INTEGER,
	created_on TIMESTAMP NOT NULL 
); 

CREATE TABLE PointUsage (
	cid INTEGER PRIMARY KEY,
	point_used INTEGER NOT NULL,
	used_on TIMESTAMP NOT NULL,
	FOREIGN KEY (cid) REFERENCES Customers
); 

CREATE TABLE LocationArea (
	area_id SERIAL UNIQUE NOT NULL,
	area_name varchar(200) PRIMARY KEY
);

CREATE TYPE ostatus as ENUM('WAITING', 'DELIVERING', 'COMPLETED');
CREATE TABLE Orders ( -- total part from Order to Contains not enforced
	oid SERIAL PRIMARY KEY,
	use_credit_card BOOL NOT NULL, --- constraint btw credit card or points not enforced ---
	use_points BOOL NOT NULL,
	order_time TIMESTAMP NOT NULL,
	order_status ostatus NOT NULL, -- this ok?
	price DECIMAL(10, 2) NOT NULL,
	delivery_fee DECIMAL(5, 2) NOT NULL,
	address VARCHAR(100) NOT NULL,
	location_area varchar(200) NOT NULL,
	cid INTEGER NOT NULL,
	gain_reward_pts INTEGER NOT NULL,
	FOREIGN KEY (cid) REFERENCES Customers,
	FOREIGN KEY (location_area) REFERENCES LocationArea
);

CREATE TABLE Category (
	catid SERIAL PRIMARY KEY,
	catname VARCHAR(50),
	description VARCHAR(200)
);

CREATE TABLE FoodItem (
	fid SERIAl PRIMARY KEY,
	rid INTEGER NOT NULL,
	fname VARCHAR(50) NOT NULL,
	description TEXT,
	catid INTEGER NOT NULL,
	food_limit INTEGER NOT NULL,
	current_qty INTEGER NOT NULL DEFAULT 0,
	price DECIMAL(5, 2) NOT NULL,
	FOREIGN KEY (rid) references Restaurants,
	FOREIGN KEY (catid) references Category
);

CREATE TYPE campaignEnum as ENUM('DiscountPromo');
CREATE TABLE PromoCampaign (
	pcid SERIAL PRIMARY KEY,
	campaign_type campaignEnum NOT NULL,
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP NOT NULL
);

CREATE TABLE PromoByRestaurant (
	pcid INTEGER PRIMARY KEY,
	rid 	INTEGER NOT NULL,
	FOREIGN KEY (rid) REFERENCES Restaurants,
	FOREIGN KEY (pcid) REFERENCES PromoCampaign
);

CREATE TABLE PromoBFDS (
	pcid INTEGER PRIMARY KEY,
	FOREIGN KEY (pcid) REFERENCES PromoCampaign
);

CREATE TABLE DiscountPromo (
	pcid INTEGER PRIMARY KEY,
	min_spend	INTEGER,
	max_spend INTEGER,
	discount 	INTEGER,
	FOREIGN KEY	 (pcid) REFERENCES PromoCampaign
);


CREATE TABLE OrderPromoCampaignUsage (
	oid INTEGER NOT NULL,
	pcid INTEGER NOT NULL,
	PRIMARY KEY(oid, pcid),
	FOREIGN KEY(oid) REFERENCES Orders on DELETE CASCADE,
	FOREIGN KEY(pcid) REFERENCES PromoCampaign on DELETE CASCADE
);


-- CREATE TABLE OrderItem (  -- full part from OrderItem to Place not enforced
-- 	ooid SERIAL UNIQUE, -- have to add UNIQUE, but i thot SERIAL ensures uniqueness?
-- 	oid INTEGER,
-- 	qty INTEGER NOT NULL,
-- 	PRIMARY KEY (ooid, oid),
-- 	FOREIGN KEY (oid) REFERENCES Orders ON DELETE CASCADE	
-- );
CREATE TABLE OrderItem (  
	oiid INTEGER, -- order item number that is depending on Order. eg orderItem 1 for Order 1
	oid INTEGER,
	qty INTEGER NOT NULL,
	fid INTEGER NOT NULL,
	notes_to_restaurant varchar(500),
	PRIMARY KEY (oiid, oid),
	FOREIGN KEY (oid) REFERENCES Orders ON DELETE CASCADE,
	FOREIGN KEY (fid) REFERENCES FoodItem ON DELETE CASCADE	
);

-- CREATE TABLE Place (
-- 	ooid INTEGER REFERENCES OrderItem(ooid) on DELETE CASCADE,
-- 	fid INTEGER,
-- 	qty INTEGER NOT NULL,
-- 	PRIMARY KEY (ooid, fid),
-- 	FOREIGN KEY (fid) REFERENCES FoodItem(fid) ON DELETE CASCADE
-- );

CREATE TABLE RestaurantReview (
	oid INTEGER Primary key,
	description TEXT,
	FOREIGN key (oid) REFERENCES Orders
);

CREATE TABLE Belongs (
	oid INTEGER, 
	rid INTEGER,
	PRIMARY KEY (oid, rid),
	FOREIGN KEY (oid) REFERENCES Orders,
	FOREIGN KEY (rid) REFERENCES Restaurants
);

CREATE TABLE Eligible (
	cid INTEGER,
	pcid INTEGER,
	PRIMARY KEY (cid, pcid),
	FOREIGN KEY (cid) REFERENCES Customers,
	FOREIGN KEY (pcid) REFERENCES PromoCampaign
);

CREATE TYPE emp_type AS ENUM ('Manager', 'Rider');
CREATE TABLE FDSEmployee (
	empid		SERIAL PRIMARY KEY,
	emptype     emp_type NOT NULL,  -- i changed the struct to implement exclusive ISA constraint
	emp_first_name	VARCHAR(50) NOT NULL,
	emp_last_name	VARCHAR(50) NOT NULL,
	email		VARCHAR(50) UNIQUE NOT NULL,
	emppassword	VARCHAR(20) NOT NULL
);

CREATE TABLE WorkShift (
	wsid 			SERIAL PRIMARY KEY,
	h1				BOOLEAN DEFAULT false, -- 0-1
	h2				BOOLEAN DEFAULT false, -- 1-2
	h3				BOOLEAN DEFAULT false, -- 2-3
	h4				BOOLEAN DEFAULT false, -- 3-4
	h5				BOOLEAN DEFAULT false, -- 4-5
	h6				BOOLEAN DEFAULT false, -- 5-6
	h7				BOOLEAN DEFAULT false, -- 6-7
	h8				BOOLEAN DEFAULT false, -- 7-8
	h9				BOOLEAN DEFAULT false, -- 8-9
	h10				BOOLEAN DEFAULT false, -- 9-10
	h11				BOOLEAN DEFAULT false, -- 10-11
	h12				BOOLEAN DEFAULT false, -- 11-12
	valid_full_time	BOOLEAN DEFAULT false,
	UNIQUE (h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12)
);

create or replace function count_hours(id integer)
	returns integer as $$
	select case
		when (exists (select 1 from workshift where wsid = id))
			then 
				(select (h1::int + h2::int + h3::int + h4::int + h5::int + h6::int + h7::int + h8::int + h9::int + h10::int + h11::int + h12::int)
				from WorkShift
				where wsid = id)
		else 0
	end
	$$ language sql;

CREATE TABLE Rider (
	empid		INTEGER PRIMARY KEY,
	isPartTime	BOOLEAN NOT NULL,
	FOREIGN KEY (empid) REFERENCES FDSEmployee (empid) ON DELETE CASCADE
);

CREATE TABLE WWS (
	empid					INTEGER PRIMARY KEY,
	Monday				INTEGER,
	Tuesday				INTEGER,
	Wednesday			INTEGER,
	Thursday			INTEGER,
	Friday				INTEGER,
	Saturday			INTEGER,
	Sunday				INTEGER,
	FOREIGN KEY (Monday) REFERENCES WorkShift (wsid),
	FOREIGN KEY (Tuesday) REFERENCES WorkShift (wsid),
	FOREIGN KEY (Wednesday) REFERENCES WorkShift (wsid),
	FOREIGN KEY (Thursday) REFERENCES WorkShift (wsid),
	FOREIGN KEY (Friday) REFERENCES WorkShift (wsid),
	FOREIGN KEY (Saturday) REFERENCES WorkShift (wsid),
	FOREIGN KEY (Sunday) REFERENCES WorkShift (wsid),
	FOREIGN KEY (empid) REFERENCES Rider (empid)
);

create or replace function is_fulltime_workshift(id integer)
	returns BOOLEAN as $$
		select case
			when (exists (select 1 from workshift where wsid = id)) then
				(select valid_full_time from workshift where wsid = id)
			else false
		end;
	$$ language sql;

create or replace function is_work_day(id integer)
	returns BOOLEAN as $$
		select case
			when id IS NULL then false
			when count_hours(id) = 0 then false
			else true
		end;
	$$ language sql;

create view workday_schedule (empid, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) as
select 
			empid,
			is_work_day(Monday) as Monday,
			is_work_day(Tuesday) as Tuesday,
			is_work_day(Wednesday) as Wednesday,
			is_work_day(Thursday) as Thursday,
			is_work_day(Friday) as Friday,
			is_work_day(Saturday) as Saturday,
			is_work_day(Sunday) as Sunday
			from WWS
;


create or replace function total_week_hours(id integer)
	returns integer as $$
		SELECT (count_hours(W.Monday) + count_hours(W.Tuesday) + count_hours(W.Wednesday) + count_hours(W.Thursday) + count_hours(W.Friday) + count_hours(W.Saturday) + count_hours(W.Sunday))
		FROM WWS W
		WHERE W.empid = id;
	$$ language sql;

create or replace function num_riders(wday text, wshift text)
	returns integer as $$
	DECLARE x integer;
	BEGIN
			EXECUTE FORMAT('
				select sum(h) as total from (select S.%I::int as h from WWS W, workshift S where W.%I = S.wsid) T', wshift, wday) INTO x;
			RETURN x;
	END;
	$$ language plpgsql;

CREATE TABLE Manager (
	empid INTEGER PRIMARY KEY,
	FOREIGN KEY (empid) REFERENCES FDSEmployee (empid) ON DELETE CASCADE
);

CREATE TABLE Assigned (
	oid			INTEGER PRIMARY KEY,
	empid		INTEGER NOT NULL,
	toRestaurantTime			TIMESTAMP,
	arriveAtRestaurantTime		TIMESTAMP,
	restaurantToCustomerTime	TIMESTAMP,
	arriveAtCustomerTime		TIMESTAMP,
	commission					FLOAT DEFAULT 0,
	FOREIGN KEY (oid) REFERENCES Orders (oid),
	FOREIGN KEY (empid) REFERENCES Rider (empid)
);

create or replace function count_commision(id integer, month TIMESTAMP, period text)
	returns FLOAT as $$
		select case
			when (exists (select 1 from Assigned A where A.empid = id and DATE_TRUNC(period, A.arriveAtCustomerTime) = DATE_TRUNC(period, month))) then
				(select SUM (commission) AS total
				FROM Assigned A
				Where A.empid = id and DATE_TRUNC(period, A.arriveAtCustomerTime) = DATE_TRUNC(period, month))
			else 0
		end;
	$$ language sql;

CREATE TABLE Salary (
	empid	INTEGER,
	month	DATE,
	salary	DECIMAL(10,2) NOT NULL DEFAULT 0,
	total_hours INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY (empid, month),
	FOREIGN KEY (empid) REFERENCES Rider (empid)
);

create or replace procedure update_weekly_salary (id integer)
	as $$
		insert into Salary (empid, month, salary)
		VALUES (id, DATE_TRUNC('month', current_timestamp), total_week_hours(id) * 20 + count_commision(id, NOW()::TIMESTAMP, 'week')) 
		on conflict (empid, month)
		DO
		UPDATE
		SET salary = Salary.salary + total_week_hours(id) * 20 + count_commision(id, NOW()::TIMESTAMP, 'week');
	$$ language sql;

create or replace procedure update_monthly_salary (id integer)
	as $$
		insert into Salary (empid, month, salary)
		VALUES (id, DATE_TRUNC('month', current_timestamp), 5000 + count_commision(id, NOW()::TIMESTAMP, 'month')) 
		on conflict (empid, month)
		DO nothing;
	$$ language sql;

CREATE TABLE RiderRatings (
	oid SERIAL PRIMARY KEY,
	rating SMALLINT NOT NULL,
	FOREIGN KEY (oid) REFERENCES Assigned
);

CREATE TABLE ClockIn (
	id					SERIAL PRIMARY KEY,
	empid				INTEGER REFERENCES Rider (empid),
	timeIn			TIMESTAMP DEFAULT NOW(),
	timeOut			TIMESTAMP DEFAULT NULL,
	onDelivery	BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE OrderWaitingList (
	oid					INTEGER PRIMARY KEY REFERENCES Orders ON DELETE	CASCADE,
	queueNum			SERIAL NOT NULL UNIQUE,
	orderAssigned		BOOLEAN NOT NULL DEFAULT FALSE
);


-- -- incomplete trigger
-- CREATE OR REPLACE FUNCTION total_part_orderitem_wrt_place () RETURNS TRIGGER AS
-- $$ 
-- DECLARE
-- 	orderitem_id INTEGER;
-- 	ok boolean;
-- BEGIN
-- 	IF (TG_TABLE_NAME = 'Place') THEN
-- 		orderitem_id = NEW.ooid;
-- 	ELSE
-- 		orderitem_id = OLD.ooid;
-- 	END IF;
-- END;
-- $$ 
-- LANGUAGE plpgsql;

-- /* Trigger for insert/update on OrderItem */
-- --DROP TRIGGER IF EXISTS
-- --total_part_orderitem_place_trigger_on_place on Place CASCADE;
-- CREATE constraint TRIGGER
-- total_part_orderitem_place_trigger_on_place
-- AFTER INSERT OR UPDATE of ooid ON Place
-- deferrable initially deferred
-- FOR EACH ROW 
-- EXECUTE FUNCTION
-- total_part_orderitem_wrt_place();

