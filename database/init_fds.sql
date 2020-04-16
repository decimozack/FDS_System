DROP TABLE IF EXISTS RestaurantStaff CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS Sells CASCADE;
DROP TABLE IF EXISTS Menu CASCADE;
DROP TABLE IF EXISTS FoodItem CASCADE;
DROP TABLE IF EXISTS Category CASCADE;
DROP TABLE IF EXISTS Offers CASCADE;
DROP TABLE IF EXISTS OrderItem CASCADE;
DROP TABLE IF EXISTS Place CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS RestaurantReviews CASCADE;
DROP TABLE IF EXISTS RestaurantReview CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Salary CASCADE;
DROP TABLE IF EXISTS Belongs CASCADE;
DROP TABLE IF EXISTS PromoCampaign CASCADE;
DROP TABLE IF EXISTS Uses CASCADE;
DROP TABLE IF EXISTS Eligible CASCADE;
DROP TABLE IF EXISTS FDSEmployee CASCADE;
DROP TABLE IF EXISTS Rider CASCADE;
DROP TABLE IF EXISTS WWS CASCADE;
DROP TABLE IF EXISTS OrderWaitingList CASCADE;
DROP TABLE IF EXISTS WorkShift CASCADE;
DROP TABLE IF EXISTS RiderReviews CASCADE;
DROP TABLE IF EXISTS RiderReview CASCADE;
DROP TABLE IF EXISTS Assigned CASCADE;
DROP TABLE IF EXISTS ClockIn CASCADE;
DROP TABLE IF EXISTS Manager CASCADE;
DROP TYPE IF EXISTS ostatus CASCADE;
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

CREATE TYPE ostatus as ENUM('WAITING', 'DELIVERING', 'COMPLETED');
CREATE TABLE Orders ( -- total part from Order to Contains not enforced
	oid SERIAL PRIMARY KEY,
	use_credit_card BOOL NOT NULL, --- constraint btw credit card or points not enforced ---
	use_points BOOL NOT NULL,
	order_time TIMESTAMP NOT NULL,
	order_status ostatus NOT NULL, -- this ok?
	price DECIMAL(5, 2) NOT NULL,
	delivery_fee DECIMAL(5, 2) NOT NULL,
	address VARCHAR(100) NOT NULL,
	cid INTEGER NOT NULL,
	gain_reward_pts INTEGER NOT NULL,
	FOREIGN KEY (cid) REFERENCES Customers
);

CREATE TABLE Menu (
	mid SERIAL PRIMARY KEY,
	mname VARCHAR(50),
	start_time TIME(0) NOT NULL,
	end_time TIME(0) NOT NULL
);

CREATE TABLE Category (
	catid SERIAL PRIMARY KEY,
	catname VARCHAR(50),
	description VARCHAR(200)
);

CREATE TABLE FoodItem (
	fid SERIAl PRIMARY KEY,
	fname VARCHAR(50) NOT NULL,
	description TEXT,
	catid INTEGER NOT NULL,
	FOREIGN KEY (catid) references Category
);

CREATE TABLE Sells (
	rid INTEGER NOT NULL,
	mid INTEGER NOT NULL,
	fid INTEGER NOT NULL,
	food_limit INTEGER NOT NULL,
	current_qty INTEGER NOT NULL,
	price DECIMAL(5, 2) NOT NULL,
	PRIMARY KEY (rid, mid, fid),
	FOREIGN KEY (rid) REFERENCES Restaurants,
	FOREIGN KEY (mid) REFERENCES Menu,
	FOREIGN KEY (fid) REFERENCES FoodItem 
);

CREATE TABLE PromoCampaign (
	pcid SERIAL PRIMARY KEY,
	campaign_type VARCHAR(20) NOT NULL,
	from_restaurant VARCHAR(50) NOT NULL, -- ? --
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP NOT NULL	
);

CREATE TABLE Uses (
	oid INTEGER NOT NULL,
	pcid INTEGER NOT NULL,
	PRIMARY KEY(oid, pcid)
);

CREATE TABLE Offers (
	rid INTEGER,
	pcid INTEGER,
	PRIMARY KEY (rid, pcid),
	FOREIGN KEY (rid) REFERENCES Restaurants,
	FOREIGN KEY (pcid) REFERENCES PromoCampaign
);

CREATE TABLE OrderItem (  -- full part from OrderItem to Place not enforced
	ooid SERIAL UNIQUE, -- have to add UNIQUE, but i thot SERIAL ensures uniqueness?
	oid INTEGER,
	PRIMARY KEY (ooid, oid),
	FOREIGN KEY (oid) REFERENCES Orders ON DELETE CASCADE	
);

CREATE TABLE Place (
	ooid INTEGER REFERENCES OrderItem(ooid) on DELETE CASCADE,
	rid INTEGER,
	mid INTEGER,
	fid INTEGER,
	qty INTEGER NOT NULL,
	PRIMARY KEY (ooid, rid, mid, fid),
	FOREIGN KEY (rid, mid, fid) REFERENCES Sells(rid, mid, fid) ON DELETE CASCADE
);

CREATE TABLE RestaurantReview (
	rid SERIAL PRIMARY KEY,
	rating SMALLINT NOT NULL,
	description TEXT
);

CREATE TABLE RestaurantReviews (
	rid INTEGER,
	oid INTEGER,
	PRIMARY KEY (rid, oid),
	FOREIGN KEY (rid) REFERENCES RestaurantReview,
	FOREIGN KEY (oid) REFERENCES Orders
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

CREATE TABLE FDSEmployee (
	empid		SERIAL PRIMARY KEY,
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
	valid_full_time	BOOLEAN DEFAULT false
);

CREATE OR REPLACE FUNCTION check_valid_workshift () RETURNS TRIGGER
	AS $$
DECLARE
	window1	integer;
	window2	integer;
	window3	integer;
	window4	integer;
	window5	integer;
	window6	integer;
	window7	integer;
	window8	integer;
BEGIN
	SELECT (W.h1::int + W.h2::int + W.h3::int + W.h4::int + W.h5::int) INTO window1
		FROM WorkShift W
		WHERE W.wsid = NEW.wsid;
	SELECT (W.h2::int + W.h3::int + W.h4::int + W.h5::int + W.h6::int) INTO window2
		FROM WorkShift W
		WHERE W.wsid = NEW.wsid;
	SELECT (W.h3::int + W.h4::int + W.h5::int + W.h6::int + W.h7::int) INTO window3
		FROM WorkShift W
		WHERE W.wsid = NEW.wsid;
	SELECT (W.h4::int + W.h5::int + W.h6::int + W.h7::int + W.h8::int) INTO window4
		FROM WorkShift W
		WHERE W.wsid = NEW.wsid;
	SELECT (W.h5::int + W.h6::int + W.h7::int + W.h8::int + W.h9::int) INTO window5
		FROM WorkShift W
		WHERE W.wsid = NEW.wsid;
	SELECT (W.h6::int + W.h7::int + W.h8::int + W.h9::int + W.h10::int) INTO window6
		FROM WorkShift W
		WHERE W.wsid = NEW.wsid;
	SELECT (W.h7::int + W.h8::int + W.h9::int + W.h10::int + W.h11::int) INTO window7
		FROM WorkShift W
		WHERE W.wsid = NEW.wsid;
	SELECT (W.h8::int + W.h9::int + W.h10::int + W.h11::int + W.h12::int) INTO window8
		FROM WorkShift W
		WHERE W.wsid = NEW.wsid;
	IF (window1 > 4 or window2 > 4 or window3 > 4 or window4 > 4 or window5 > 4 or window6  > 4 or window7 > 4 or window8 > 4) THEN
		RAISE exception 'Invalid workshift';
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS workshift_check_trigger ON WorkShift CASCADE;
CREATE TRIGGER workshift_check_trigger
	AFTER UPDATE OR INSERT ON WorkShift
	FOR EACH ROW
	EXECUTE FUNCTION check_valid_workshift();

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

CREATE OR REPLACE FUNCTION check_valid_fulltime () RETURNS TRIGGER
	AS $$
DECLARE
	total_work_day integer;
	offWindow1	integer;
	offWindow2	integer;
	offWindow3	integer;
	offWindow4	integer;
	offWindow5	integer;
	offWindow6	integer;
	offWindow7	integer;
BEGIN
	SELECT Monday::int + Tuesday::int + Wednesday::int + Thursday::int + Friday::int + Saturday::int + Sunday::int INTO total_work_day
		FROM workday_schedule
		WHERE empid = NEW.empid;
	SELECT Monday::int + Tuesday::int INTO offWindow1
		FROM workday_schedule
		WHERE empid = NEW.empid;
	SELECT Tuesday::int + Wednesday::int INTO offWindow2
		FROM workday_schedule
		WHERE empid = NEW.empid;
	SELECT Wednesday::int + Thursday::int INTO offWindow3
		FROM workday_schedule
		WHERE empid = NEW.empid;
	SELECT Thursday::int + Friday::int INTO offWindow4
		FROM workday_schedule
		WHERE empid = NEW.empid;
	SELECT Friday::int + Saturday::int INTO offWindow5
		FROM workday_schedule
		WHERE empid = NEW.empid;
	SELECT Saturday::int + Sunday::int INTO offWindow6
		FROM workday_schedule
		WHERE empid = NEW.empid;
	SELECT Sunday::int + Monday::int INTO offWindow7
		FROM workday_schedule
		WHERE empid = NEW.empid;
	IF NOT (select isPartTime from Rider where empid = NEW.empid) and 
		(total_work_day != 5 or NOT (offWindow1 = 0 or offWindow2 = 0 or offWindow3 = 0 or offWindow4 = 0 or offWindow5 = 0 or offWindow6 = 0 or offWindow7 = 0)) THEN
		RAISE exception 'Invalid Full time WWS';
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fulltime_wws_check_trigger ON WWS CASCADE;
CREATE TRIGGER fulltime_wws_check_trigger
	AFTER UPDATE OR INSERT ON WWS
	FOR EACH ROW
	EXECUTE FUNCTION check_valid_fulltime();

create or replace function total_week_hours(id integer)
	returns integer as $$
		SELECT (count_hours(W.Monday) + count_hours(W.Tuesday) + count_hours(W.Wednesday) + count_hours(W.Thursday) + count_hours(W.Friday) + count_hours(W.Saturday) + count_hours(W.Sunday))
		FROM WWS W
		WHERE W.empid = id;
	$$ language sql;

CREATE OR REPLACE FUNCTION check_valid_wws () RETURNS TRIGGER
	AS $$
DECLARE
	total_work_hours integer;
BEGIN
	SELECT total_week_hours(NEW.empid) INTO total_work_hours;
	IF (total_work_hours < 10 or total_work_hours > 48) THEN
		RAISE exception 'Invalid WWS';
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wws_check_trigger ON WWS CASCADE;
CREATE TRIGGER wws_check_trigger
	AFTER UPDATE OR INSERT ON WWS
	FOR EACH ROW
	EXECUTE FUNCTION check_valid_wws();

create or replace function num_riders(wday text, wshift text)
	returns integer as $$
	DECLARE x integer;
	BEGIN
			EXECUTE FORMAT('
				select sum(h) as total from (select S.%I::int as h from WWS W, workshift S where W.%I = S.wsid) T', wshift, wday) INTO x;
			RETURN x;
	END;
	$$ language plpgsql;


CREATE OR REPLACE FUNCTION check_min_riders () RETURNS TRIGGER
	AS $$
BEGIN
	IF (num_riders('monday', 'h1') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 10';
	END IF;
	IF (num_riders('monday', 'h2') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 11';
	END IF;
	IF (num_riders('monday', 'h3') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 12';
	END IF;
	IF (num_riders('monday', 'h4') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 13';
	END IF;
	IF (num_riders('monday', 'h5') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 14';
	END IF;
	IF (num_riders('monday', 'h6') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 15';
	END IF;
	IF (num_riders('monday', 'h7') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 16';
	END IF;
	IF (num_riders('monday', 'h8') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 17';
	END IF;
	IF (num_riders('monday', 'h9') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 18';
	END IF;
	IF (num_riders('monday', 'h10') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 19';
	END IF;
	IF (num_riders('monday', 'h11') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 20';
	END IF;
	IF (num_riders('monday', 'h12') < 5) THEN
	RAISE exception 'Insufficient Riders on monday at time 21';
	END IF;
	IF (num_riders('tuesday', 'h1') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 10';
	END IF;
	IF (num_riders('tuesday', 'h2') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 11';
	END IF;
	IF (num_riders('tuesday', 'h3') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 12';
	END IF;
	IF (num_riders('tuesday', 'h4') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 13';
	END IF;
	IF (num_riders('tuesday', 'h5') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 14';
	END IF;
	IF (num_riders('tuesday', 'h6') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 15';
	END IF;
	IF (num_riders('tuesday', 'h7') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 16';
	END IF;
	IF (num_riders('tuesday', 'h8') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 17';
	END IF;
	IF (num_riders('tuesday', 'h9') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 18';
	END IF;
	IF (num_riders('tuesday', 'h10') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 19';
	END IF;
	IF (num_riders('tuesday', 'h11') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 20';
	END IF;
	IF (num_riders('tuesday', 'h12') < 5) THEN
	RAISE exception 'Insufficient Riders on tuesday at time 21';
	END IF;
	IF (num_riders('wednesday', 'h1') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 10';
	END IF;
	IF (num_riders('wednesday', 'h2') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 11';
	END IF;
	IF (num_riders('wednesday', 'h3') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 12';
	END IF;
	IF (num_riders('wednesday', 'h4') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 13';
	END IF;
	IF (num_riders('wednesday', 'h5') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 14';
	END IF;
	IF (num_riders('wednesday', 'h6') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 15';
	END IF;
	IF (num_riders('wednesday', 'h7') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 16';
	END IF;
	IF (num_riders('wednesday', 'h8') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 17';
	END IF;
	IF (num_riders('wednesday', 'h9') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 18';
	END IF;
	IF (num_riders('wednesday', 'h10') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 19';
	END IF;
	IF (num_riders('wednesday', 'h11') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 20';
	END IF;
	IF (num_riders('wednesday', 'h12') < 5) THEN
	RAISE exception 'Insufficient Riders on wednesday at time 21';
	END IF;
	IF (num_riders('thursday', 'h1') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 10';
	END IF;
	IF (num_riders('thursday', 'h2') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 11';
	END IF;
	IF (num_riders('thursday', 'h3') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 12';
	END IF;
	IF (num_riders('thursday', 'h4') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 13';
	END IF;
	IF (num_riders('thursday', 'h5') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 14';
	END IF;
	IF (num_riders('thursday', 'h6') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 15';
	END IF;
	IF (num_riders('thursday', 'h7') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 16';
	END IF;
	IF (num_riders('thursday', 'h8') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 17';
	END IF;
	IF (num_riders('thursday', 'h9') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 18';
	END IF;
	IF (num_riders('thursday', 'h10') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 19';
	END IF;
	IF (num_riders('thursday', 'h11') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 20';
	END IF;
	IF (num_riders('thursday', 'h12') < 5) THEN
	RAISE exception 'Insufficient Riders on thursday at time 21';
	END IF;
	IF (num_riders('friday', 'h1') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 10';
	END IF;
	IF (num_riders('friday', 'h2') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 11';
	END IF;
	IF (num_riders('friday', 'h3') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 12';
	END IF;
	IF (num_riders('friday', 'h4') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 13';
	END IF;
	IF (num_riders('friday', 'h5') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 14';
	END IF;
	IF (num_riders('friday', 'h6') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 15';
	END IF;
	IF (num_riders('friday', 'h7') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 16';
	END IF;
	IF (num_riders('friday', 'h8') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 17';
	END IF;
	IF (num_riders('friday', 'h9') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 18';
	END IF;
	IF (num_riders('friday', 'h10') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 19';
	END IF;
	IF (num_riders('friday', 'h11') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 20';
	END IF;
	IF (num_riders('friday', 'h12') < 5) THEN
	RAISE exception 'Insufficient Riders on friday at time 21';
	END IF;
	IF (num_riders('saturday', 'h1') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 10';
	END IF;
	IF (num_riders('saturday', 'h2') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 11';
	END IF;
	IF (num_riders('saturday', 'h3') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 12';
	END IF;
	IF (num_riders('saturday', 'h4') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 13';
	END IF;
	IF (num_riders('saturday', 'h5') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 14';
	END IF;
	IF (num_riders('saturday', 'h6') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 15';
	END IF;
	IF (num_riders('saturday', 'h7') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 16';
	END IF;
	IF (num_riders('saturday', 'h8') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 17';
	END IF;
	IF (num_riders('saturday', 'h9') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 18';
	END IF;
	IF (num_riders('saturday', 'h10') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 19';
	END IF;
	IF (num_riders('saturday', 'h11') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 20';
	END IF;
	IF (num_riders('saturday', 'h12') < 5) THEN
	RAISE exception 'Insufficient Riders on saturday at time 21';
	END IF;
	IF (num_riders('sunday', 'h1') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 10';
	END IF;
	IF (num_riders('sunday', 'h2') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 11';
	END IF;
	IF (num_riders('sunday', 'h3') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 12';
	END IF;
	IF (num_riders('sunday', 'h4') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 13';
	END IF;
	IF (num_riders('sunday', 'h5') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 14';
	END IF;
	IF (num_riders('sunday', 'h6') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 15';
	END IF;
	IF (num_riders('sunday', 'h7') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 16';
	END IF;
	IF (num_riders('sunday', 'h8') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 17';
	END IF;
	IF (num_riders('sunday', 'h9') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 18';
	END IF;
	IF (num_riders('sunday', 'h10') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 19';
	END IF;
	IF (num_riders('sunday', 'h11') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 20';
	END IF;
	IF (num_riders('sunday', 'h12') < 5) THEN
	RAISE exception 'Insufficient Riders on sunday at time 21';
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_min_riders_trigger ON WWS CASCADE;
CREATE TRIGGER check_min_riders_trigger
	AFTER UPDATE ON WWS
	FOR EACH ROW
	EXECUTE FUNCTION check_min_riders();


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

create or replace function count_commision(id integer, month TIMESTAMP)
	returns FLOAT as $$
		select case
			when (exists (select 1 from Assigned A where A.empid = id and DATE_TRUNC('month', A.arriveAtCustomerTime) = DATE_TRUNC('month', month))) then
				(select SUM (commission) AS total
				FROM Assigned A
				Where A.empid = id and DATE_TRUNC('month', A.arriveAtCustomerTime) = DATE_TRUNC('month', month))
			else 0
		end;
	$$ language sql;

CREATE TABLE Salary (
	empid	INTEGER,
	month	DATE,
	salary	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY (empid, month),
	FOREIGN KEY (empid) REFERENCES Rider (empid)
);

create or replace procedure update_weekly_salary (id integer)
	as $$
		insert into Salary (empid, month, salary)
		VALUES (id, DATE_TRUNC('month', current_timestamp), total_week_hours(id) * 20 + count_commision(id, NOW()::TIMESTAMP)) 
		on conflict (empid, month)
		DO
		UPDATE
		SET salary = Salary.salary + total_week_hours(id) * 20 + count_commision(id, NOW()::TIMESTAMP);
	$$ language sql;

CREATE TABLE RiderReview (
	rrid SERIAL PRIMARY KEY,
	rating SMALLINT NOT NULL,
	description VARCHAR(100)
);

CREATE TABLE RiderReviews (
	rrid INTEGER,
	cid INTEGER,
	PRIMARY KEY(rrid, cid),
	FOREIGN KEY (rrid) REFERENCES RiderReview,
	FOREIGN KEY (cid) REFERENCES Customers
);

CREATE TABLE ClockIn (
	id					SERIAL PRIMARY KEY,
	empid				INTEGER REFERENCES Rider (empid),
	timeIn			TIMESTAMP DEFAULT NOW(),
	timeOut			TIMESTAMP DEFAULT NULL,
	hoursWorked	INTEGER DEFAULT 0,
	onDelivery	BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE OrderWaitingList (
	oid					INTEGER PRIMARY KEY REFERENCES Orders ON DELETE	CASCADE,
	queueNum			SERIAL NOT NULL UNIQUE,
	orderAssigned		BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE OR REPLACE FUNCTION assign_order() RETURNS TRIGGER AS
$$
DECLARE
	clockin_id INTEGER;
BEGIN
	IF (SELECT EXISTS(SELECT 1 FROM ClockIn WHERE timeOut IS NULL AND onDelivery = FALSE)) THEN
		clockin_id := (SELECT id FROM ClockIn WHERE timeOut IS NULL AND onDelivery = FALSE ORDER BY RANDOM() LIMIT 1);
		INSERT INTO Assigned (orderid, empid, commission)
		VALUES (NEW.orderid, (SELECT empid FROM ClockIn WHERE id = clockin_id), 10);
		UPDATE OrderWaitingList SET orderAssigned = TRUE WHERE orderid = NEW.orderid;
		UPDATE ClockIn SET onDelivery = TRUE WHERE id = clockin_id;
	END IF;
	RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER assign_order_trigger
	AFTER INSERT
	ON OrderWaitingList
	FOR EACH ROW
	EXECUTE FUNCTION assign_order();


-- incomplete trigger
CREATE OR REPLACE FUNCTION total_part_orderitem_wrt_place () RETURNS TRIGGER AS
$$ 
DECLARE
	orderitem_id INTEGER;
	ok boolean;
BEGIN
	IF (TG_TABLE_NAME = 'Place') THEN
		orderitem_id = NEW.ooid;
	ELSE
		orderitem_id = OLD.ooid;
	END IF;
END;
$$ 
LANGUAGE plpgsql;

/* Trigger for insert/update on OrderItem */
--DROP TRIGGER IF EXISTS
--total_part_orderitem_place_trigger_on_place on Place CASCADE;
CREATE constraint TRIGGER
total_part_orderitem_place_trigger_on_place
AFTER INSERT OR UPDATE of ooid ON Place
deferrable initially deferred
FOR EACH ROW 
EXECUTE FUNCTION
total_part_orderitem_wrt_place();


INSERT INTO Restaurants (rid, rname, min_order_cost) VALUES (1, 'KFC', 3), (2, 'MacDonalds' , 2.50), (3, 'Deck', 2.10), (4, 'The Tea Party', 4.50), (5, 'Fong Seng Nasi Lemak', 1.00);
INSERT INTO RestaurantStaff (rsid, rs_first_name, rs_last_name, email, rspassword, rid) VALUES (1, 'John','Doe', 'john@example.com', 'johndoe123', 1), (2, 'Dominic', 'Frank', 'domthed@gmail.com', 'benedict312', 3), (3, 'Dominic', 'Quek', 'quek@example.com', '65nf76', 5), (4, 'Peter', 'Pan', 'pan@ocbc.edu', '87ghf', 4);
INSERT INTO Customers (cid, c_first_name, c_last_name, email, cpassword, credit_card_info, reward_pts, created_on) VALUES (1, 'Benedict', 'Quek', 'bene@hotmail.com', 'dictdict96', 'DBS 9821-2112', 10, current_timestamp), (2, 'Zachary', 'Tan', 'tanzack@nus.com', 'fhas7612', 'POSB 312321132', 0, current_timestamp), (3, 'Chen', 'Hua', 'chenhua@gmail.com', 'fdsf64324', 'DBS 1232', 50, current_timestamp), (4, 'Joyce', 'Tan', 'joyceytan@gmail.com', 'ashda6969', 'OCBC 321123', 61, current_timestamp), (5, 'John', 'Elijah Tan', 'elijah@dbs.email.co', 'dasni324', 'DBS 1213', 1, current_timestamp);
INSERT INTO Orders (oid, use_credit_card, use_points, order_time, order_status, price, delivery_fee, address, gain_reward_pts, cid) VALUES (1, true, false, '2038-01-19 03:14:07' ,'WAITING', 10.50, 3.00, 'Clementi 96', 20, 1);
INSERT INTO Menu (mid, mname, start_time, end_time) VALUES (1, 'All-time', '09:00:00', '18:00:00'), (2, 'Breakfast', '08:00:00', '12:00:00');
INSERT INTO Category (catid, catname, description) VALUES (1, 'Western', 'This is western cuisine.'), (2, 'Asian', 'Delicious cooked by Singaporeans');
INSERT INTO FoodItem (fid, fname, description, catid) VALUES (1, 'Black Pepper Steak', 'Steak topped with pepper sauce', 1), (2, 'Carrot Cake', 'Cake made of red carrot. Yummy!', 2);
INSERT INTO Sells (rid, mid, fid, food_limit, current_qty, price) VALUES (2, 1, 1, 100, 100, 3.00), (3, 2, 2, 200, 190, 5.10), (1, 1, 1, 50, 50, 4.50);
INSERT INTO PromoCampaign (pcid, campaign_type, from_restaurant, start_time, end_time) VALUES (1, 'Chinese New Year', 'KFC' , '2038-01-19 03:14:07', '2038-01-19 03:15:07');
INSERT INTO Uses (oid, pcid) VALUES (1, 1), (3, 1);
INSERT INTO Offers (rid, pcid) VALUES (1, 1), (2, 1);
INSERT INTO OrderItem (ooid, oid) VALUES (1, 1), (2, 1), (3, 1);
INSERT INTO Place (ooid, rid, mid, fid, qty) VALUES (1, 2, 1, 1 , 3), (2, 1, 1, 1, 10); -- (1, 1, 1, 1, 10);
INSERT INTO RestaurantReview (rid, rating, description) VALUES (1, 3, 'Goodplace'), (2, 4, 'Conducive'), (3, 5,'');
INSERT INTO RestaurantReviews (rid, oid) VALUES (1, 1); 
INSERT INTO Belongs (oid, rid) VALUES (1, 1);
INSERT INTO Eligible (cid, pcid) VALUES (2, 1), (3, 1), (4, 1);

-- INSERT INTO WorkShift (wsid, all_work_hours, num_hours) VALUES (0, 0, 0);
-- INSERT INTO WorkShift (all_work_hours, num_hours) VALUES (1,1), (2,1), (3,2), (4,1), (5,2), (6,2), (7,3), (8,1), (9,2), (10,2), (11,3), (12,2), (13,3), (14,3), (15,4), (16,1), (17,2), (18,2), (19,3), (20,2), (21,3), (22,3), (23,4), (24,2), (25,3), (26,3), (27,4), (28,3), (29,4), (30,4), (31,5), (32,1), (33,2), (34,2), (35,3), (36,2), (37,3), (38,3), (39,4), (40,2), (41,3), (42,3), (43,4), (44,3), (45,4), (46,4), (47,5), (48,2), (49,3), (50,3), (51,4), (52,3), (53,4), (54,4), (55,5), (56,3), (57,4), (58,4), (59,5), (60,4), (61,5), (62,5), (63,6), (64,1), (65,2), (66,2), (67,3), (68,2), (69,3), (70,3), (71,4), (72,2), (73,3), (74,3), (75,4), (76,3), (77,4), (78,4), (79,5), (80,2), (81,3), (82,3), (83,4), (84,3), (85,4), (86,4), (87,5), (88,3), (89,4), (90,4), (91,5), (92,4), (93,5), (94,5), (96,2), (97,3), (98,3), (99,4), (100,3), (101,4), (102,4), (103,5), (104,3), (105,4), (106,4), (107,5), (108,4), (109,5), (110,5), (111,6), (112,3), (113,4), (114,4), (115,5), (116,4), (117,5), (118,5), (119,6), (120,4), (121,5), (122,5), (123,6), (124,5), (125,6), (126,6), (127,7), (128,1), (129,2), (130,2), (131,3), (132,2), (133,3), (134,3), (135,4), (136,2), (137,3), (138,3), (139,4), (140,3), (141,4), (142,4), (143,5), (144,2), (145,3), (146,3), (147,4), (148,3), (149,4), (150,4), (151,5), (152,3), (153,4), (154,4), (155,5), (156,4), (157,5), (158,5), (160,2), (161,3), (162,3), (163,4), (164,3), (165,4), (166,4), (167,5), (168,3), (169,4), (170,4), (171,5), (172,4), (173,5), (174,5), (175,6), (176,3), (177,4), (178,4), (179,5), (180,4), (181,5), (182,5), (183,6), (184,4), (185,5), (186,5), (187,6), (188,5), (189,6), (192,2), (193,3), (194,3), (195,4), (196,3), (197,4), (198,4), (199,5), (200,3), (201,4), (202,4), (203,5), (204,4), (205,5), (206,5), (207,6), (208,3), (209,4), (210,4), (211,5), (212,4), (213,5), (214,5), (215,6), (216,4), (217,5), (218,5), (219,6), (220,5), (221,6), (222,6), (224,3), (225,4), (226,4), (227,5), (228,4), (229,5), (230,5), (231,6), (232,4), (233,5), (234,5), (235,6), (236,5), (237,6), (238,6), (239,7), (240,4), (241,5), (242,5), (243,6), (244,5), (245,6), (246,6), (247,7), (248,5), (249,6), (250,6), (251,7), (252,6), (253,7), (254,7), (255,8), (256,1), (257,2), (258,2), (259,3), (260,2), (261,3), (262,3), (263,4), (264,2), (265,3), (266,3), (267,4), (268,3), (269,4), (270,4), (271,5), (272,2), (273,3), (274,3), (275,4), (276,3), (277,4), (278,4), (279,5), (280,3), (281,4), (282,4), (283,5), (284,4), (285,5), (286,5), (288,2), (289,3), (290,3), (291,4), (292,3), (293,4), (294,4), (295,5), (296,3), (297,4), (298,4), (299,5), (300,4), (301,5), (302,5), (303,6), (304,3), (305,4), (306,4), (307,5), (308,4), (309,5), (310,5), (311,6), (312,4), (313,5), (314,5), (315,6), (316,5), (317,6), (320,2), (321,3), (322,3), (323,4), (324,3), (325,4), (326,4), (327,5), (328,3), (329,4), (330,4), (331,5), (332,4), (333,5), (334,5), (335,6), (336,3), (337,4), (338,4), (339,5), (340,4), (341,5), (342,5), (343,6), (344,4), (345,5), (346,5), (347,6), (348,5), (349,6), (350,6), (352,3), (353,4), (354,4), (355,5), (356,4), (357,5), (358,5), (359,6), (360,4), (361,5), (362,5), (363,6), (364,5), (365,6), (366,6), (367,7), (368,4), (369,5), (370,5), (371,6), (372,5), (373,6), (374,6), (375,7), (376,5), (377,6), (378,6), (379,7), (384,2), (385,3), (386,3), (387,4), (388,3), (389,4), (390,4), (391,5), (392,3), (393,4), (394,4), (395,5), (396,4), (397,5), (398,5), (399,6), (400,3), (401,4), (402,4), (403,5), (404,4), (405,5), (406,5), (407,6), (408,4), (409,5), (410,5), (411,6), (412,5), (413,6), (414,6), (416,3), (417,4), (418,4), (419,5), (420,4), (421,5), (422,5), (423,6), (424,4), (425,5), (426,5), (427,6), (428,5), (429,6), (430,6), (431,7), (432,4), (433,5), (434,5), (435,6), (436,5), (437,6), (438,6), (439,7), (440,5), (441,6), (442,6), (443,7), (444,6), (445,7), (448,3), (449,4), (450,4), (451,5), (452,4), (453,5), (454,5), (455,6), (456,4), (457,5), (458,5), (459,6), (460,5), (461,6), (462,6), (463,7), (464,4), (465,5), (466,5), (467,6), (468,5), (469,6), (470,6), (471,7), (472,5), (473,6), (474,6), (475,7), (476,6), (477,7), (478,7), (480,4), (481,5), (482,5), (483,6), (484,5), (485,6), (486,6), (487,7), (488,5), (489,6), (490,6), (491,7), (492,6), (493,7), (494,7), (495,8), (496,5), (497,6), (498,6), (499,7), (500,6), (501,7), (502,7), (503,8), (504,6), (505,7), (506,7), (507,8), (508,7), (509,8), (510,8), (511,9), (512,1), (513,2), (514,2), (515,3), (516,2), (517,3), (518,3), (519,4), (520,2), (521,3), (522,3), (523,4), (524,3), (525,4), (526,4), (527,5), (528,2), (529,3), (530,3), (531,4), (532,3), (533,4), (534,4), (535,5), (536,3), (537,4), (538,4), (539,5), (540,4), (541,5), (542,5), (544,2), (545,3), (546,3), (547,4), (548,3), (549,4), (550,4), (551,5), (552,3), (553,4), (554,4), (555,5), (556,4), (557,5), (558,5), (559,6), (560,3), (561,4), (562,4), (563,5), (564,4), (565,5), (566,5), (567,6), (568,4), (569,5), (570,5), (571,6), (572,5), (573,6), (576,2), (577,3), (578,3), (579,4), (580,3), (581,4), (582,4), (583,5), (584,3), (585,4), (586,4), (587,5), (588,4), (589,5), (590,5), (591,6), (592,3), (593,4), (594,4), (595,5), (596,4), (597,5), (598,5), (599,6), (600,4), (601,5), (602,5), (603,6), (604,5), (605,6), (606,6), (608,3), (609,4), (610,4), (611,5), (612,4), (613,5), (614,5), (615,6), (616,4), (617,5), (618,5), (619,6), (620,5), (621,6), (622,6), (623,7), (624,4), (625,5), (626,5), (627,6), (628,5), (629,6), (630,6), (631,7), (632,5), (633,6), (634,6), (635,7), (640,2), (641,3), (642,3), (643,4), (644,3), (645,4), (646,4), (647,5), (648,3), (649,4), (650,4), (651,5), (652,4), (653,5), (654,5), (655,6), (656,3), (657,4), (658,4), (659,5), (660,4), (661,5), (662,5), (663,6), (664,4), (665,5), (666,5), (667,6), (668,5), (669,6), (670,6), (672,3), (673,4), (674,4), (675,5), (676,4), (677,5), (678,5), (679,6), (680,4), (681,5), (682,5), (683,6), (684,5), (685,6), (686,6), (687,7), (688,4), (689,5), (690,5), (691,6), (692,5), (693,6), (694,6), (695,7), (696,5), (697,6), (698,6), (699,7), (700,6), (701,7), (704,3), (705,4), (706,4), (707,5), (708,4), (709,5), (710,5), (711,6), (712,4), (713,5), (714,5), (715,6), (716,5), (717,6), (718,6), (719,7), (720,4), (721,5), (722,5), (723,6), (724,5), (725,6), (726,6), (727,7), (728,5), (729,6), (730,6), (731,7), (732,6), (733,7), (734,7), (736,4), (737,5), (738,5), (739,6), (740,5), (741,6), (742,6), (743,7), (744,5), (745,6), (746,6), (747,7), (748,6), (749,7), (750,7), (751,8), (752,5), (753,6), (754,6), (755,7), (756,6), (757,7), (758,7), (759,8), (768,2), (769,3), (770,3), (771,4), (772,3), (773,4), (774,4), (775,5), (776,3), (777,4), (778,4), (779,5), (780,4), (781,5), (782,5), (783,6), (784,3), (785,4), (786,4), (787,5), (788,4), (789,5), (790,5), (791,6), (792,4), (793,5), (794,5), (795,6), (796,5), (797,6), (798,6), (800,3), (801,4), (802,4), (803,5), (804,4), (805,5);
-- INSERT INTO WorkShift (all_work_hours, num_hours) VALUES (806,5), (807,6), (808,4), (809,5), (810,5), (811,6), (812,5), (813,6), (814,6), (815,7), (816,4), (817,5), (818,5), (819,6), (820,5), (821,6), (822,6), (823,7), (824,5), (825,6), (826,6), (827,7), (828,6), (829,7), (832,3), (833,4), (834,4), (835,5), (836,4), (837,5), (838,5), (839,6), (840,4), (841,5), (842,5), (843,6), (844,5), (845,6), (846,6), (847,7), (848,4), (849,5), (850,5), (851,6), (852,5), (853,6), (854,6), (855,7), (856,5), (857,6), (858,6), (859,7), (860,6), (861,7), (862,7), (864,4), (865,5), (866,5), (867,6), (868,5), (869,6), (870,6), (871,7), (872,5), (873,6), (874,6), (875,7), (876,6), (877,7), (878,7), (879,8), (880,5), (881,6), (882,6), (883,7), (884,6), (885,7), (886,7), (887,8), (888,6), (889,7), (890,7), (891,8), (896,3), (897,4), (898,4), (899,5), (900,4), (901,5), (902,5), (903,6), (904,4), (905,5), (906,5), (907,6), (908,5), (909,6), (910,6), (911,7), (912,4), (913,5), (914,5), (915,6), (916,5), (917,6), (918,6), (919,7), (920,5), (921,6), (922,6), (923,7), (924,6), (925,7), (926,7), (928,4), (929,5), (930,5), (931,6), (932,5), (933,6), (934,6), (935,7), (936,5), (937,6), (938,6), (939,7), (940,6), (941,7), (942,7), (943,8), (944,5), (945,6), (946,6), (947,7), (948,6), (949,7), (950,7), (951,8), (952,6), (953,7), (954,7), (955,8), (956,7), (957,8), (960,4), (961,5), (962,5), (963,6), (964,5), (965,6), (966,6), (967,7), (968,5), (969,6), (970,6), (971,7), (972,6), (973,7), (974,7), (975,8), (976,5), (977,6), (978,6), (979,7), (980,6), (981,7), (982,7), (983,8), (984,6), (985,7), (986,7), (987,8), (988,7), (989,8), (990,8), (992,5), (993,6), (994,6), (995,7), (996,6), (997,7), (998,7), (999,8), (1000,6), (1001,7), (1002,7), (1003,8), (1004,7), (1005,8), (1006,8), (1007,9), (1008,6), (1009,7), (1010,7), (1011,8), (1012,7), (1013,8), (1014,8), (1015,9), (1016,7), (1017,8), (1018,8), (1019,9), (1020,8), (1021,9), (1022,9), (1023,10), (1024,1), (1025,2), (1026,2), (1027,3), (1028,2), (1029,3), (1030,3), (1031,4), (1032,2), (1033,3), (1034,3), (1035,4), (1036,3), (1037,4), (1038,4), (1039,5), (1040,2), (1041,3), (1042,3), (1043,4), (1044,3), (1045,4), (1046,4), (1047,5), (1048,3), (1049,4), (1050,4), (1051,5), (1052,4), (1053,5), (1054,5), (1056,2), (1057,3), (1058,3), (1059,4), (1060,3), (1061,4), (1062,4), (1063,5), (1064,3), (1065,4), (1066,4), (1067,5), (1068,4), (1069,5), (1070,5), (1071,6), (1072,3), (1073,4), (1074,4), (1075,5), (1076,4), (1077,5), (1078,5), (1079,6), (1080,4), (1081,5), (1082,5), (1083,6), (1084,5), (1085,6), (1088,2), (1089,3), (1090,3), (1091,4), (1092,3), (1093,4), (1094,4), (1095,5), (1096,3), (1097,4), (1098,4), (1099,5), (1100,4), (1101,5), (1102,5), (1103,6), (1104,3), (1105,4), (1106,4), (1107,5), (1108,4), (1109,5), (1110,5), (1111,6), (1112,4), (1113,5), (1114,5), (1115,6), (1116,5), (1117,6), (1118,6), (1120,3), (1121,4), (1122,4), (1123,5), (1124,4), (1125,5), (1126,5), (1127,6), (1128,4), (1129,5), (1130,5), (1131,6), (1132,5), (1133,6), (1134,6), (1135,7), (1136,4), (1137,5), (1138,5), (1139,6), (1140,5), (1141,6), (1142,6), (1143,7), (1144,5), (1145,6), (1146,6), (1147,7), (1152,2), (1153,3), (1154,3), (1155,4), (1156,3), (1157,4), (1158,4), (1159,5), (1160,3), (1161,4), (1162,4), (1163,5), (1164,4), (1165,5), (1166,5), (1167,6), (1168,3), (1169,4), (1170,4), (1171,5), (1172,4), (1173,5), (1174,5), (1175,6), (1176,4), (1177,5), (1178,5), (1179,6), (1180,5), (1181,6), (1182,6), (1184,3), (1185,4), (1186,4), (1187,5), (1188,4), (1189,5), (1190,5), (1191,6), (1192,4), (1193,5), (1194,5), (1195,6), (1196,5), (1197,6), (1198,6), (1199,7), (1200,4), (1201,5), (1202,5), (1203,6), (1204,5), (1205,6), (1206,6), (1207,7), (1208,5), (1209,6), (1210,6), (1211,7), (1212,6), (1213,7), (1216,3), (1217,4), (1218,4), (1219,5), (1220,4), (1221,5), (1222,5), (1223,6), (1224,4), (1225,5), (1226,5), (1227,6), (1228,5), (1229,6), (1230,6), (1231,7), (1232,4), (1233,5), (1234,5), (1235,6), (1236,5), (1237,6), (1238,6), (1239,7), (1240,5), (1241,6), (1242,6), (1243,7), (1244,6), (1245,7), (1246,7), (1248,4), (1249,5), (1250,5), (1251,6), (1252,5), (1253,6), (1254,6), (1255,7), (1256,5), (1257,6), (1258,6), (1259,7), (1260,6), (1261,7), (1262,7), (1263,8), (1264,5), (1265,6), (1266,6), (1267,7), (1268,6), (1269,7), (1270,7), (1271,8), (1280,2), (1281,3), (1282,3), (1283,4), (1284,3), (1285,4), (1286,4), (1287,5), (1288,3), (1289,4), (1290,4), (1291,5), (1292,4), (1293,5), (1294,5), (1295,6), (1296,3), (1297,4), (1298,4), (1299,5), (1300,4), (1301,5), (1302,5), (1303,6), (1304,4), (1305,5), (1306,5), (1307,6), (1308,5), (1309,6), (1310,6), (1312,3), (1313,4), (1314,4), (1315,5), (1316,4), (1317,5), (1318,5), (1319,6), (1320,4), (1321,5), (1322,5), (1323,6), (1324,5), (1325,6), (1326,6), (1327,7), (1328,4), (1329,5), (1330,5), (1331,6), (1332,5), (1333,6), (1334,6), (1335,7), (1336,5), (1337,6), (1338,6), (1339,7), (1340,6), (1341,7), (1344,3), (1345,4), (1346,4), (1347,5), (1348,4), (1349,5), (1350,5), (1351,6), (1352,4), (1353,5), (1354,5), (1355,6), (1356,5), (1357,6), (1358,6), (1359,7), (1360,4), (1361,5), (1362,5), (1363,6), (1364,5), (1365,6), (1366,6), (1367,7), (1368,5), (1369,6), (1370,6), (1371,7), (1372,6), (1373,7), (1374,7), (1376,4), (1377,5), (1378,5), (1379,6), (1380,5), (1381,6), (1382,6), (1383,7), (1384,5), (1385,6), (1386,6), (1387,7), (1388,6), (1389,7), (1390,7), (1391,8), (1392,5), (1393,6), (1394,6), (1395,7), (1396,6), (1397,7), (1398,7), (1399,8), (1400,6), (1401,7), (1402,7), (1403,8), (1408,3), (1409,4), (1410,4), (1411,5), (1412,4), (1413,5), (1414,5), (1415,6), (1416,4), (1417,5), (1418,5), (1419,6), (1420,5), (1421,6), (1422,6), (1423,7), (1424,4), (1425,5), (1426,5), (1427,6), (1428,5), (1429,6), (1430,6), (1431,7), (1432,5), (1433,6), (1434,6), (1435,7), (1436,6), (1437,7), (1438,7), (1440,4), (1441,5), (1442,5), (1443,6), (1444,5), (1445,6), (1446,6), (1447,7), (1448,5), (1449,6), (1450,6), (1451,7), (1452,6), (1453,7), (1454,7), (1455,8), (1456,5), (1457,6), (1458,6), (1459,7), (1460,6), (1461,7), (1462,7), (1463,8), (1464,6), (1465,7), (1466,7), (1467,8), (1468,7), (1469,8), (1472,4), (1473,5), (1474,5), (1475,6), (1476,5), (1477,6), (1478,6), (1479,7), (1480,5), (1481,6), (1482,6), (1483,7), (1484,6), (1485,7), (1486,7), (1487,8), (1488,5), (1489,6), (1490,6), (1491,7), (1492,6), (1493,7), (1494,7), (1495,8), (1496,6), (1497,7), (1498,7), (1499,8), (1500,7), (1501,8), (1502,8), (1504,5), (1505,6), (1506,6), (1507,7), (1508,6), (1509,7), (1510,7), (1511,8), (1512,6), (1513,7), (1514,7), (1515,8), (1516,7), (1517,8), (1518,8), (1519,9), (1536,2), (1537,3), (1538,3), (1539,4), (1540,3), (1541,4), (1542,4), (1543,5), (1544,3), (1545,4), (1546,4), (1547,5), (1548,4), (1549,5), (1550,5), (1551,6), (1552,3), (1553,4), (1554,4), (1555,5), (1556,4), (1557,5), (1558,5), (1559,6), (1560,4), (1561,5), (1562,5); 
-- INSERT INTO WorkShift (all_work_hours, num_hours) VALUES (1563,6), (1564,5), (1565,6), (1566,6), (1568,3), (1569,4), (1570,4), (1571,5), (1572,4), (1573,5), (1574,5), (1575,6), (1576,4), (1577,5), (1578,5), (1579,6), (1580,5), (1581,6), (1582,6), (1583,7), (1584,4), (1585,5), (1586,5), (1587,6), (1588,5), (1589,6), (1590,6), (1591,7), (1592,5), (1593,6), (1594,6), (1595,7), (1596,6), (1597,7), (1600,3), (1601,4), (1602,4), (1603,5), (1604,4), (1605,5), (1606,5), (1607,6), (1608,4), (1609,5), (1610,5), (1611,6), (1612,5), (1613,6), (1614,6), (1615,7), (1616,4), (1617,5), (1618,5), (1619,6), (1620,5), (1621,6), (1622,6), (1623,7), (1624,5), (1625,6), (1626,6), (1627,7), (1628,6), (1629,7), (1630,7), (1632,4), (1633,5), (1634,5), (1635,6), (1636,5), (1637,6), (1638,6), (1639,7), (1640,5), (1641,6), (1642,6), (1643,7), (1644,6), (1645,7), (1646,7), (1647,8), (1648,5), (1649,6), (1650,6), (1651,7), (1652,6), (1653,7), (1654,7), (1655,8), (1656,6), (1657,7), (1658,7), (1659,8), (1664,3), (1665,4), (1666,4), (1667,5), (1668,4), (1669,5), (1670,5), (1671,6), (1672,4), (1673,5), (1674,5), (1675,6), (1676,5), (1677,6), (1678,6), (1679,7), (1680,4), (1681,5), (1682,5), (1683,6), (1684,5), (1685,6), (1686,6), (1687,7), (1688,5), (1689,6), (1690,6), (1691,7), (1692,6), (1693,7), (1694,7), (1696,4), (1697,5), (1698,5), (1699,6), (1700,5), (1701,6), (1702,6), (1703,7), (1704,5), (1705,6), (1706,6), (1707,7), (1708,6), (1709,7), (1710,7), (1711,8), (1712,5), (1713,6), (1714,6), (1715,7), (1716,6), (1717,7), (1718,7), (1719,8), (1720,6), (1721,7), (1722,7), (1723,8), (1724,7), (1725,8), (1728,4), (1729,5), (1730,5), (1731,6), (1732,5), (1733,6), (1734,6), (1735,7), (1736,5), (1737,6), (1738,6), (1739,7), (1740,6), (1741,7), (1742,7), (1743,8), (1744,5), (1745,6), (1746,6), (1747,7), (1748,6), (1749,7), (1750,7), (1751,8), (1752,6), (1753,7), (1754,7), (1755,8), (1756,7), (1757,8), (1758,8), (1760,5), (1761,6), (1762,6), (1763,7), (1764,6), (1765,7), (1766,7), (1767,8), (1768,6), (1769,7), (1770,7), (1771,8), (1772,7), (1773,8), (1774,8), (1775,9), (1776,6), (1777,7), (1778,7), (1779,8), (1780,7), (1781,8), (1782,8), (1783,9), (1792,3), (1793,4), (1794,4), (1795,5), (1796,4), (1797,5), (1798,5), (1799,6), (1800,4), (1801,5), (1802,5), (1803,6), (1804,5), (1805,6), (1806,6), (1807,7), (1808,4), (1809,5), (1810,5), (1811,6), (1812,5), (1813,6), (1814,6), (1815,7), (1816,5), (1817,6), (1818,6), (1819,7), (1820,6), (1821,7), (1822,7), (1824,4), (1825,5), (1826,5), (1827,6), (1828,5), (1829,6), (1830,6), (1831,7), (1832,5), (1833,6), (1834,6), (1835,7), (1836,6), (1837,7), (1838,7), (1839,8), (1840,5), (1841,6), (1842,6), (1843,7), (1844,6), (1845,7), (1846,7), (1847,8), (1848,6), (1849,7), (1850,7), (1851,8), (1852,7), (1853,8), (1856,4), (1857,5), (1858,5), (1859,6), (1860,5), (1861,6), (1862,6), (1863,7), (1864,5), (1865,6), (1866,6), (1867,7), (1868,6), (1869,7), (1870,7), (1871,8), (1872,5), (1873,6), (1874,6), (1875,7), (1876,6), (1877,7), (1878,7), (1879,8), (1880,6), (1881,7), (1882,7), (1883,8), (1884,7), (1885,8), (1886,8), (1888,5), (1889,6), (1890,6), (1891,7), (1892,6), (1893,7), (1894,7), (1895,8), (1896,6), (1897,7), (1898,7), (1899,8), (1900,7), (1901,8), (1902,8), (1903,9), (1904,6), (1905,7), (1906,7), (1907,8), (1908,7), (1909,8), (1910,8), (1911,9), (1912,7), (1913,8), (1914,8), (1915,9), (1920,4), (1921,5), (1922,5), (1923,6), (1924,5), (1925,6), (1926,6), (1927,7), (1928,5), (1929,6), (1930,6), (1931,7), (1932,6), (1933,7), (1934,7), (1935,8), (1936,5), (1937,6), (1938,6), (1939,7), (1940,6), (1941,7), (1942,7), (1943,8), (1944,6), (1945,7), (1946,7), (1947,8), (1948,7), (1949,8), (1950,8), (1952,5), (1953,6), (1954,6), (1955,7), (1956,6), (1957,7), (1958,7), (1959,8), (1960,6), (1961,7), (1962,7), (1963,8), (1964,7), (1965,8), (1966,8), (1967,9), (1968,6), (1969,7), (1970,7), (1971,8), (1972,7), (1973,8), (1974,8), (1975,9), (1976,7), (1977,8), (1978,8), (1979,9), (1980,8), (1981,9), (1984,5), (1985,6), (1986,6), (1987,7), (1988,6), (1989,7), (1990,7), (1991,8), (1992,6), (1993,7), (1994,7), (1995,8), (1996,7), (1997,8), (1998,8), (1999,9), (2000,6), (2001,7), (2002,7), (2003,8), (2004,7), (2005,8), (2006,8), (2007,9), (2008,7), (2009,8), (2010,8), (2011,9), (2012,8), (2013,9), (2014,9), (2016,6), (2017,7), (2018,7), (2019,8), (2020,7), (2021,8), (2022,8), (2023,9), (2024,7), (2025,8), (2026,8), (2027,9), (2028,8), (2029,9), (2030,9), (2031,10), (2032,7), (2033,8), (2034,8), (2035,9), (2036,8), (2037,9), (2038,9), (2039,10), (2040,8), (2041,9), (2042,9), (2043,10), (2044,9), (2045,10), (2046,10), (2047,11), (2048,1), (2049,2), (2050,2), (2051,3), (2052,2), (2053,3), (2054,3), (2055,4), (2056,2), (2057,3), (2058,3), (2059,4), (2060,3), (2061,4), (2062,4), (2063,5), (2064,2), (2065,3), (2066,3), (2067,4), (2068,3), (2069,4), (2070,4), (2071,5), (2072,3), (2073,4), (2074,4), (2075,5), (2076,4), (2077,5), (2078,5), (2080,2), (2081,3), (2082,3), (2083,4), (2084,3), (2085,4), (2086,4), (2087,5), (2088,3), (2089,4), (2090,4), (2091,5), (2092,4), (2093,5), (2094,5), (2095,6), (2096,3), (2097,4), (2098,4), (2099,5), (2100,4), (2101,5), (2102,5), (2103,6), (2104,4), (2105,5), (2106,5), (2107,6), (2108,5), (2109,6), (2112,2), (2113,3), (2114,3), (2115,4), (2116,3), (2117,4), (2118,4), (2119,5), (2120,3), (2121,4), (2122,4), (2123,5), (2124,4), (2125,5), (2126,5), (2127,6), (2128,3), (2129,4), (2130,4), (2131,5), (2132,4), (2133,5), (2134,5), (2135,6), (2136,4), (2137,5), (2138,5), (2139,6), (2140,5), (2141,6), (2142,6), (2144,3), (2145,4), (2146,4), (2147,5), (2148,4), (2149,5), (2150,5), (2151,6), (2152,4), (2153,5), (2154,5), (2155,6), (2156,5), (2157,6), (2158,6), (2159,7), (2160,4), (2161,5), (2162,5), (2163,6), (2164,5), (2165,6), (2166,6), (2167,7), (2168,5), (2169,6), (2170,6), (2171,7), (2176,2), (2177,3), (2178,3), (2179,4), (2180,3), (2181,4), (2182,4), (2183,5), (2184,3), (2185,4), (2186,4), (2187,5), (2188,4), (2189,5), (2190,5), (2191,6), (2192,3), (2193,4), (2194,4), (2195,5), (2196,4), (2197,5), (2198,5), (2199,6), (2200,4), (2201,5), (2202,5), (2203,6), (2204,5), (2205,6), (2206,6), (2208,3), (2209,4), (2210,4), (2211,5), (2212,4), (2213,5), (2214,5), (2215,6), (2216,4), (2217,5), (2218,5), (2219,6), (2220,5), (2221,6), (2222,6), (2223,7), (2224,4), (2225,5), (2226,5), (2227,6), (2228,5), (2229,6), (2230,6), (2231,7), (2232,5), (2233,6), (2234,6), (2235,7), (2236,6), (2237,7), (2240,3), (2241,4), (2242,4), (2243,5), (2244,4), (2245,5), (2246,5), (2247,6), (2248,4), (2249,5), (2250,5), (2251,6), (2252,5), (2253,6), (2254,6), (2255,7), (2256,4), (2257,5), (2258,5), (2259,6), (2260,5), (2261,6), (2262,6), (2263,7), (2264,5), (2265,6), (2266,6), (2267,7), (2268,6), (2269,7), (2270,7), (2272,4), (2273,5), (2274,5), (2275,6), (2276,5), (2277,6), (2278,6), (2279,7), (2280,5), (2281,6), (2282,6), (2283,7), (2284,6), (2285,7);
-- INSERT INTO WorkShift (all_work_hours, num_hours) VALUES (2286,7), (2287,8), (2288,5), (2289,6), (2290,6), (2291,7), (2292,6), (2293,7), (2294,7), (2295,8), (2304,2), (2305,3), (2306,3), (2307,4), (2308,3), (2309,4), (2310,4), (2311,5), (2312,3), (2313,4), (2314,4), (2315,5), (2316,4), (2317,5), (2318,5), (2319,6), (2320,3), (2321,4), (2322,4), (2323,5), (2324,4), (2325,5), (2326,5), (2327,6), (2328,4), (2329,5), (2330,5), (2331,6), (2332,5), (2333,6), (2334,6), (2336,3), (2337,4), (2338,4), (2339,5), (2340,4), (2341,5), (2342,5), (2343,6), (2344,4), (2345,5), (2346,5), (2347,6), (2348,5), (2349,6), (2350,6), (2351,7), (2352,4), (2353,5), (2354,5), (2355,6), (2356,5), (2357,6), (2358,6), (2359,7), (2360,5), (2361,6), (2362,6), (2363,7), (2364,6), (2365,7), (2368,3), (2369,4), (2370,4), (2371,5), (2372,4), (2373,5), (2374,5), (2375,6), (2376,4), (2377,5), (2378,5), (2379,6), (2380,5), (2381,6), (2382,6), (2383,7), (2384,4), (2385,5), (2386,5), (2387,6), (2388,5), (2389,6), (2390,6), (2391,7), (2392,5), (2393,6), (2394,6), (2395,7), (2396,6), (2397,7), (2398,7), (2400,4), (2401,5), (2402,5), (2403,6), (2404,5), (2405,6), (2406,6), (2407,7), (2408,5), (2409,6), (2410,6), (2411,7), (2412,6), (2413,7), (2414,7), (2415,8), (2416,5), (2417,6), (2418,6), (2419,7), (2420,6), (2421,7), (2422,7), (2423,8), (2424,6), (2425,7), (2426,7), (2427,8), (2432,3), (2433,4), (2434,4), (2435,5), (2436,4), (2437,5), (2438,5), (2439,6), (2440,4), (2441,5), (2442,5), (2443,6), (2444,5), (2445,6), (2446,6), (2447,7), (2448,4), (2449,5), (2450,5), (2451,6), (2452,5), (2453,6), (2454,6), (2455,7), (2456,5), (2457,6), (2458,6), (2459,7), (2460,6), (2461,7), (2462,7), (2464,4), (2465,5), (2466,5), (2467,6), (2468,5), (2469,6), (2470,6), (2471,7), (2472,5), (2473,6), (2474,6), (2475,7), (2476,6), (2477,7), (2478,7), (2479,8), (2480,5), (2481,6), (2482,6), (2483,7), (2484,6), (2485,7), (2486,7), (2487,8), (2488,6), (2489,7), (2490,7), (2491,8), (2492,7), (2493,8), (2496,4), (2497,5), (2498,5), (2499,6), (2500,5), (2501,6), (2502,6), (2503,7), (2504,5), (2505,6), (2506,6), (2507,7), (2508,6), (2509,7), (2510,7), (2511,8), (2512,5), (2513,6), (2514,6), (2515,7), (2516,6), (2517,7), (2518,7), (2519,8), (2520,6), (2521,7), (2522,7), (2523,8), (2524,7), (2525,8), (2526,8), (2528,5), (2529,6), (2530,6), (2531,7), (2532,6), (2533,7), (2534,7), (2535,8), (2536,6), (2537,7), (2538,7), (2539,8), (2540,7), (2541,8), (2542,8), (2543,9), (2560,2), (2561,3), (2562,3), (2563,4), (2564,3), (2565,4), (2566,4), (2567,5), (2568,3), (2569,4), (2570,4), (2571,5), (2572,4), (2573,5), (2574,5), (2575,6), (2576,3), (2577,4), (2578,4), (2579,5), (2580,4), (2581,5), (2582,5), (2583,6), (2584,4), (2585,5), (2586,5), (2587,6), (2588,5), (2589,6), (2590,6), (2592,3), (2593,4), (2594,4), (2595,5), (2596,4), (2597,5), (2598,5), (2599,6), (2600,4), (2601,5), (2602,5), (2603,6), (2604,5), (2605,6), (2606,6), (2607,7), (2608,4), (2609,5), (2610,5), (2611,6), (2612,5), (2613,6), (2614,6), (2615,7), (2616,5), (2617,6), (2618,6), (2619,7), (2620,6), (2621,7), (2624,3), (2625,4), (2626,4), (2627,5), (2628,4), (2629,5), (2630,5), (2631,6), (2632,4), (2633,5), (2634,5), (2635,6), (2636,5), (2637,6), (2638,6), (2639,7), (2640,4), (2641,5), (2642,5), (2643,6), (2644,5), (2645,6), (2646,6), (2647,7), (2648,5), (2649,6), (2650,6), (2651,7), (2652,6), (2653,7), (2654,7), (2656,4), (2657,5), (2658,5), (2659,6), (2660,5), (2661,6), (2662,6), (2663,7), (2664,5), (2665,6), (2666,6), (2667,7), (2668,6), (2669,7), (2670,7), (2671,8), (2672,5), (2673,6), (2674,6), (2675,7), (2676,6), (2677,7), (2678,7), (2679,8), (2680,6), (2681,7), (2682,7), (2683,8), (2688,3), (2689,4), (2690,4), (2691,5), (2692,4), (2693,5), (2694,5), (2695,6), (2696,4), (2697,5), (2698,5), (2699,6), (2700,5), (2701,6), (2702,6), (2703,7), (2704,4), (2705,5), (2706,5), (2707,6), (2708,5), (2709,6), (2710,6), (2711,7), (2712,5), (2713,6), (2714,6), (2715,7), (2716,6), (2717,7), (2718,7), (2720,4), (2721,5), (2722,5), (2723,6), (2724,5), (2725,6), (2726,6), (2727,7), (2728,5), (2729,6), (2730,6), (2731,7), (2732,6), (2733,7), (2734,7), (2735,8), (2736,5), (2737,6), (2738,6), (2739,7), (2740,6), (2741,7), (2742,7), (2743,8), (2744,6), (2745,7), (2746,7), (2747,8), (2748,7), (2749,8), (2752,4), (2753,5), (2754,5), (2755,6), (2756,5), (2757,6), (2758,6), (2759,7), (2760,5), (2761,6), (2762,6), (2763,7), (2764,6), (2765,7), (2766,7), (2767,8), (2768,5), (2769,6), (2770,6), (2771,7), (2772,6), (2773,7), (2774,7), (2775,8), (2776,6), (2777,7), (2778,7), (2779,8), (2780,7), (2781,8), (2782,8), (2784,5), (2785,6), (2786,6), (2787,7), (2788,6), (2789,7), (2790,7), (2791,8), (2792,6), (2793,7), (2794,7), (2795,8), (2796,7), (2797,8), (2798,8), (2799,9), (2800,6), (2801,7), (2802,7), (2803,8), (2804,7), (2805,8), (2806,8), (2807,9), (2816,3), (2817,4), (2818,4), (2819,5), (2820,4), (2821,5), (2822,5), (2823,6), (2824,4), (2825,5), (2826,5), (2827,6), (2828,5), (2829,6), (2830,6), (2831,7), (2832,4), (2833,5), (2834,5), (2835,6), (2836,5), (2837,6), (2838,6), (2839,7), (2840,5), (2841,6), (2842,6), (2843,7), (2844,6), (2845,7), (2846,7), (2848,4), (2849,5), (2850,5), (2851,6), (2852,5), (2853,6), (2854,6), (2855,7), (2856,5), (2857,6), (2858,6), (2859,7), (2860,6), (2861,7), (2862,7), (2863,8), (2864,5), (2865,6), (2866,6), (2867,7), (2868,6), (2869,7), (2870,7), (2871,8), (2872,6), (2873,7), (2874,7), (2875,8), (2876,7), (2877,8), (2880,4), (2881,5), (2882,5), (2883,6), (2884,5), (2885,6), (2886,6), (2887,7), (2888,5), (2889,6), (2890,6), (2891,7), (2892,6), (2893,7), (2894,7), (2895,8), (2896,5), (2897,6), (2898,6), (2899,7), (2900,6), (2901,7), (2902,7), (2903,8), (2904,6), (2905,7), (2906,7), (2907,8), (2908,7), (2909,8), (2910,8), (2912,5), (2913,6), (2914,6), (2915,7), (2916,6), (2917,7), (2918,7), (2919,8), (2920,6), (2921,7), (2922,7), (2923,8), (2924,7), (2925,8), (2926,8), (2927,9), (2928,6), (2929,7), (2930,7), (2931,8), (2932,7), (2933,8), (2934,8), (2935,9), (2936,7), (2937,8), (2938,8), (2939,9), (2944,4), (2945,5), (2946,5), (2947,6), (2948,5), (2949,6), (2950,6), (2951,7), (2952,5), (2953,6), (2954,6), (2955,7), (2956,6), (2957,7), (2958,7), (2959,8), (2960,5), (2961,6), (2962,6), (2963,7), (2964,6), (2965,7), (2966,7), (2967,8), (2968,6), (2969,7), (2970,7), (2971,8), (2972,7), (2973,8), (2974,8), (2976,5), (2977,6), (2978,6), (2979,7), (2980,6), (2981,7), (2982,7), (2983,8), (2984,6), (2985,7), (2986,7), (2987,8), (2988,7), (2989,8), (2990,8), (2991,9), (2992,6), (2993,7), (2994,7), (2995,8), (2996,7), (2997,8), (2998,8), (2999,9), (3000,7), (3001,8), (3002,8), (3003,9), (3004,8), (3005,9), (3008,5), (3009,6), (3010,6), (3011,7), (3012,6), (3013,7), (3014,7), (3015,8), (3016,6), (3017,7), (3018,7), (3019,8), (3020,7), (3021,8), (3022,8), (3023,9), (3024,6), (3025,7), (3026,7), (3027,8), (3028,7), (3029,8), (3030,8), (3031,9), (3032,7);
-- INSERT INTO WorkShift (all_work_hours, num_hours) VALUES (3033,8), (3034,8), (3035,9), (3036,8), (3037,9), (3038,9), (3072,2), (3073,3), (3074,3), (3075,4), (3076,3), (3077,4), (3078,4), (3079,5), (3080,3), (3081,4), (3082,4), (3083,5), (3084,4), (3085,5), (3086,5), (3087,6), (3088,3), (3089,4), (3090,4), (3091,5), (3092,4), (3093,5), (3094,5), (3095,6), (3096,4), (3097,5), (3098,5), (3099,6), (3100,5), (3101,6), (3102,6), (3104,3), (3105,4), (3106,4), (3107,5), (3108,4), (3109,5), (3110,5), (3111,6), (3112,4), (3113,5), (3114,5), (3115,6), (3116,5), (3117,6), (3118,6), (3119,7), (3120,4), (3121,5), (3122,5), (3123,6), (3124,5), (3125,6), (3126,6), (3127,7), (3128,5), (3129,6), (3130,6), (3131,7), (3132,6), (3133,7), (3136,3), (3137,4), (3138,4), (3139,5), (3140,4), (3141,5), (3142,5), (3143,6), (3144,4), (3145,5), (3146,5), (3147,6), (3148,5), (3149,6), (3150,6), (3151,7), (3152,4), (3153,5), (3154,5), (3155,6), (3156,5), (3157,6), (3158,6), (3159,7), (3160,5), (3161,6), (3162,6), (3163,7), (3164,6), (3165,7), (3166,7), (3168,4), (3169,5), (3170,5), (3171,6), (3172,5), (3173,6), (3174,6), (3175,7), (3176,5), (3177,6), (3178,6), (3179,7), (3180,6), (3181,7), (3182,7), (3183,8), (3184,5), (3185,6), (3186,6), (3187,7), (3188,6), (3189,7), (3190,7), (3191,8), (3192,6), (3193,7), (3194,7), (3195,8), (3200,3), (3201,4), (3202,4), (3203,5), (3204,4), (3205,5), (3206,5), (3207,6), (3208,4), (3209,5), (3210,5), (3211,6), (3212,5), (3213,6), (3214,6), (3215,7), (3216,4), (3217,5), (3218,5), (3219,6), (3220,5), (3221,6), (3222,6), (3223,7), (3224,5), (3225,6), (3226,6), (3227,7), (3228,6), (3229,7), (3230,7), (3232,4), (3233,5), (3234,5), (3235,6), (3236,5), (3237,6), (3238,6), (3239,7), (3240,5), (3241,6), (3242,6), (3243,7), (3244,6), (3245,7), (3246,7), (3247,8), (3248,5), (3249,6), (3250,6), (3251,7), (3252,6), (3253,7), (3254,7), (3255,8), (3256,6), (3257,7), (3258,7), (3259,8), (3260,7), (3261,8), (3264,4), (3265,5), (3266,5), (3267,6), (3268,5), (3269,6), (3270,6), (3271,7), (3272,5), (3273,6), (3274,6), (3275,7), (3276,6), (3277,7), (3278,7), (3279,8), (3280,5), (3281,6), (3282,6), (3283,7), (3284,6), (3285,7), (3286,7), (3287,8), (3288,6), (3289,7), (3290,7), (3291,8), (3292,7), (3293,8), (3294,8), (3296,5), (3297,6), (3298,6), (3299,7), (3300,6), (3301,7), (3302,7), (3303,8), (3304,6), (3305,7), (3306,7), (3307,8), (3308,7), (3309,8), (3310,8), (3311,9), (3312,6), (3313,7), (3314,7), (3315,8), (3316,7), (3317,8), (3318,8), (3319,9), (3328,3), (3329,4), (3330,4), (3331,5), (3332,4), (3333,5), (3334,5), (3335,6), (3336,4), (3337,5), (3338,5), (3339,6), (3340,5), (3341,6), (3342,6), (3343,7), (3344,4), (3345,5), (3346,5), (3347,6), (3348,5), (3349,6), (3350,6), (3351,7), (3352,5), (3353,6), (3354,6), (3355,7), (3356,6), (3357,7), (3358,7), (3360,4), (3361,5), (3362,5), (3363,6), (3364,5), (3365,6), (3366,6), (3367,7), (3368,5), (3369,6), (3370,6), (3371,7), (3372,6), (3373,7), (3374,7), (3375,8), (3376,5), (3377,6), (3378,6), (3379,7), (3380,6), (3381,7), (3382,7), (3383,8), (3384,6), (3385,7), (3386,7), (3387,8), (3388,7), (3389,8), (3392,4), (3393,5), (3394,5), (3395,6), (3396,5), (3397,6), (3398,6), (3399,7), (3400,5), (3401,6), (3402,6), (3403,7), (3404,6), (3405,7), (3406,7), (3407,8), (3408,5), (3409,6), (3410,6), (3411,7), (3412,6), (3413,7), (3414,7), (3415,8), (3416,6), (3417,7), (3418,7), (3419,8), (3420,7), (3421,8), (3422,8), (3424,5), (3425,6), (3426,6), (3427,7), (3428,6), (3429,7), (3430,7), (3431,8), (3432,6), (3433,7), (3434,7), (3435,8), (3436,7), (3437,8), (3438,8), (3439,9), (3440,6), (3441,7), (3442,7), (3443,8), (3444,7), (3445,8), (3446,8), (3447,9), (3448,7), (3449,8), (3450,8), (3451,9), (3456,4), (3457,5), (3458,5), (3459,6), (3460,5), (3461,6), (3462,6), (3463,7), (3464,5), (3465,6), (3466,6), (3467,7), (3468,6), (3469,7), (3470,7), (3471,8), (3472,5), (3473,6), (3474,6), (3475,7), (3476,6), (3477,7), (3478,7), (3479,8), (3480,6), (3481,7), (3482,7), (3483,8), (3484,7), (3485,8), (3486,8), (3488,5), (3489,6), (3490,6), (3491,7), (3492,6), (3493,7), (3494,7), (3495,8), (3496,6), (3497,7), (3498,7), (3499,8), (3500,7), (3501,8), (3502,8), (3503,9), (3504,6), (3505,7), (3506,7), (3507,8), (3508,7), (3509,8), (3510,8), (3511,9), (3512,7), (3513,8), (3514,8), (3515,9), (3516,8), (3517,9), (3520,5), (3521,6), (3522,6), (3523,7), (3524,6), (3525,7), (3526,7), (3527,8), (3528,6), (3529,7), (3530,7), (3531,8), (3532,7), (3533,8), (3534,8), (3535,9), (3536,6), (3537,7), (3538,7), (3539,8), (3540,7), (3541,8), (3542,8), (3543,9), (3544,7), (3545,8), (3546,8), (3547,9), (3548,8), (3549,9), (3550,9), (3552,6), (3553,7), (3554,7), (3555,8), (3556,7), (3557,8), (3558,8), (3559,9), (3560,7), (3561,8), (3562,8), (3563,9), (3564,8), (3565,9), (3566,9), (3567,10), (3584,3), (3585,4), (3586,4), (3587,5), (3588,4), (3589,5), (3590,5), (3591,6), (3592,4), (3593,5), (3594,5), (3595,6), (3596,5), (3597,6), (3598,6), (3599,7), (3600,4), (3601,5), (3602,5), (3603,6), (3604,5), (3605,6), (3606,6), (3607,7), (3608,5), (3609,6), (3610,6), (3611,7), (3612,6), (3613,7), (3614,7), (3616,4), (3617,5), (3618,5), (3619,6), (3620,5), (3621,6), (3622,6), (3623,7), (3624,5), (3625,6), (3626,6), (3627,7), (3628,6), (3629,7), (3630,7), (3631,8), (3632,5), (3633,6), (3634,6), (3635,7), (3636,6), (3637,7), (3638,7), (3639,8), (3640,6), (3641,7), (3642,7), (3643,8), (3644,7), (3645,8), (3648,4), (3649,5), (3650,5), (3651,6), (3652,5), (3653,6), (3654,6), (3655,7), (3656,5), (3657,6), (3658,6), (3659,7), (3660,6), (3661,7), (3662,7), (3663,8), (3664,5), (3665,6), (3666,6), (3667,7), (3668,6), (3669,7), (3670,7), (3671,8), (3672,6), (3673,7), (3674,7), (3675,8), (3676,7), (3677,8), (3678,8), (3680,5), (3681,6), (3682,6), (3683,7), (3684,6), (3685,7), (3686,7), (3687,8), (3688,6), (3689,7), (3690,7), (3691,8), (3692,7), (3693,8), (3694,8), (3695,9), (3696,6), (3697,7), (3698,7), (3699,8), (3700,7), (3701,8), (3702,8), (3703,9), (3704,7), (3705,8), (3706,8), (3707,9), (3712,4), (3713,5), (3714,5), (3715,6), (3716,5), (3717,6), (3718,6), (3719,7), (3720,5), (3721,6), (3722,6), (3723,7), (3724,6), (3725,7), (3726,7), (3727,8), (3728,5), (3729,6), (3730,6), (3731,7), (3732,6), (3733,7), (3734,7), (3735,8), (3736,6), (3737,7), (3738,7), (3739,8), (3740,7), (3741,8), (3742,8), (3744,5), (3745,6), (3746,6), (3747,7), (3748,6), (3749,7), (3750,7), (3751,8), (3752,6), (3753,7), (3754,7), (3755,8), (3756,7), (3757,8), (3758,8), (3759,9), (3760,6), (3761,7), (3762,7), (3763,8), (3764,7), (3765,8), (3766,8), (3767,9), (3768,7), (3769,8), (3770,8), (3771,9), (3772,8), (3773,9), (3776,5), (3777,6), (3778,6), (3779,7), (3780,6), (3781,7), (3782,7), (3783,8), (3784,6), (3785,7), (3786,7), (3787,8), (3788,7), (3789,8), (3790,8), (3791,9), (3792,6), (3793,7), (3794,7), (3795,8), (3796,7), (3797,8), (3798,8), (3799,9), (3800,7), (3801,8), (3802,8), (3803,9), (3804,8);
-- INSERT INTO WorkShift (all_work_hours, num_hours) VALUES (3805,9), (3806,9), (3808,6), (3809,7), (3810,7), (3811,8), (3812,7), (3813,8), (3814,8), (3815,9), (3816,7), (3817,8), (3818,8), (3819,9), (3820,8), (3821,9), (3822,9), (3823,10), (3824,7), (3825,8), (3826,8), (3827,9), (3828,8), (3829,9), (3830,9), (3831,10), (3840,4), (3841,5), (3842,5), (3843,6), (3844,5), (3845,6), (3846,6), (3847,7), (3848,5), (3849,6), (3850,6), (3851,7), (3852,6), (3853,7), (3854,7), (3855,8), (3856,5), (3857,6), (3858,6), (3859,7), (3860,6), (3861,7), (3862,7), (3863,8), (3864,6), (3865,7), (3866,7), (3867,8), (3868,7), (3869,8), (3870,8), (3872,5), (3873,6), (3874,6), (3875,7), (3876,6), (3877,7), (3878,7), (3879,8), (3880,6), (3881,7), (3882,7), (3883,8), (3884,7), (3885,8), (3886,8), (3887,9), (3888,6), (3889,7), (3890,7), (3891,8), (3892,7), (3893,8), (3894,8), (3895,9), (3896,7), (3897,8), (3898,8), (3899,9), (3900,8), (3901,9), (3904,5), (3905,6), (3906,6), (3907,7), (3908,6), (3909,7), (3910,7), (3911,8), (3912,6), (3913,7), (3914,7), (3915,8), (3916,7), (3917,8), (3918,8), (3919,9), (3920,6), (3921,7), (3922,7), (3923,8), (3924,7), (3925,8), (3926,8), (3927,9), (3928,7), (3929,8), (3930,8), (3931,9), (3932,8), (3933,9), (3934,9), (3936,6), (3937,7), (3938,7), (3939,8), (3940,7), (3941,8), (3942,8), (3943,9), (3944,7), (3945,8), (3946,8), (3947,9), (3948,8), (3949,9), (3950,9), (3951,10), (3952,7), (3953,8), (3954,8), (3955,9), (3956,8), (3957,9), (3958,9), (3959,10), (3960,8), (3961,9), (3962,9), (3963,10), (3968,5), (3969,6), (3970,6), (3971,7), (3972,6), (3973,7), (3974,7), (3975,8), (3976,6), (3977,7), (3978,7), (3979,8), (3980,7), (3981,8), (3982,8), (3983,9), (3984,6), (3985,7), (3986,7), (3987,8), (3988,7), (3989,8), (3990,8), (3991,9), (3992,7), (3993,8), (3994,8), (3995,9), (3996,8), (3997,9), (3998,9), (4000,6), (4001,7), (4002,7), (4003,8), (4004,7), (4005,8), (4006,8), (4007,9), (4008,7), (4009,8), (4010,8), (4011,9), (4012,8), (4013,9), (4014,9), (4015,10), (4016,7), (4017,8), (4018,8), (4019,9), (4020,8), (4021,9), (4022,9), (4023,10), (4024,8), (4025,9), (4026,9), (4027,10), (4028,9), (4029,10), (4032,6), (4033,7), (4034,7), (4035,8), (4036,7), (4037,8), (4038,8), (4039,9), (4040,7), (4041,8), (4042,8), (4043,9), (4044,8), (4045,9), (4046,9), (4047,10), (4048,7), (4049,8), (4050,8), (4051,9), (4052,8), (4053,9), (4054,9), (4055,10), (4056,8), (4057,9), (4058,9), (4059,10), (4060,9), (4061,10), (4062,10), (4064,7), (4065,8), (4066,8), (4067,9), (4068,8), (4069,9), (4070,9), (4071,10), (4072,8), (4073,9), (4074,9), (4075,10), (4076,9), (4077,10), (4078,10), (4079,11), (4080,8), (4081,9), (4082,9), (4083,10), (4084,9), (4085,10), (4086,10), (4087,11), (4088,9), (4089,10), (4090,10), (4091,11), (4092,10), (4093,11), (4094,11), (4095,12);
INSERT INTO OrderWaitingList (oid, queueNum, orderAssigned) VALUES (1, 1, true);