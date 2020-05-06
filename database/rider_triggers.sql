
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
	IF NOT (select isPartTime from Rider where empid = NEW.empid) and
		NOT (select 1 from WWS where empid=NEW.empid and Monday in (0,1,2,3,4)) and
		NOT (select 1 from WWS where empid=NEW.empid and Tuesday in (0,1,2,3,4)) and
		NOT (select 1 from WWS where empid=NEW.empid and Wednesday in (0,1,2,3,4)) and
		NOT (select 1 from WWS where empid=NEW.empid and Thursday in (0,1,2,3,4)) and
		NOT (select 1 from WWS where empid=NEW.empid and Friday in (0,1,2,3,4)) and
		NOT (select 1 from WWS where empid=NEW.empid and Saturday in (0,1,2,3,4)) and
		NOT (select 1 from WWS where empid=NEW.empid and Sunday in (0,1,2,3,4)) and THEN
		RAISE exception 'Invalid Full time WWS';
	END if;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fulltime_wws_check_trigger ON WWS CASCADE;
CREATE TRIGGER fulltime_wws_check_trigger
	AFTER UPDATE OR INSERT ON WWS
	FOR EACH ROW
	EXECUTE FUNCTION check_valid_fulltime();


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


CREATE OR REPLACE FUNCTION assign_order() RETURNS TRIGGER AS
$$
DECLARE
	clockin_id INTEGER;
BEGIN
	IF (SELECT EXISTS(SELECT 1 FROM ClockIn WHERE timeOut IS NULL AND onDelivery = FALSE)) THEN
		clockin_id := (SELECT id FROM ClockIn WHERE timeOut IS NULL AND onDelivery = FALSE ORDER BY RANDOM() LIMIT 1);
		INSERT INTO Assigned (oid, empid, commission)
		VALUES (NEW.oid, (SELECT empid FROM ClockIn WHERE id = clockin_id), 10);
		UPDATE OrderWaitingList SET orderAssigned = TRUE WHERE oid = NEW.oid;
		UPDATE ClockIn SET onDelivery = TRUE WHERE id = clockin_id;
	END IF;
	RETURN NEW;
END;
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assign_order_trigger ON OrderWaitingList CASCADE;
CREATE TRIGGER assign_order_trigger
	AFTER INSERT
	ON OrderWaitingList
	FOR EACH ROW
	EXECUTE FUNCTION assign_order();

CREATE OR REPLACE FUNCTION check_clockin() RETURNS TRIGGER AS
$$
DECLARE
	isclockin BOOLEAN;
BEGIN
	SELECT exists (select 1 from ClockIn where NEW.empid = empid and timeOut is null and NEW.id != id) into isclockin;
	IF isclockin THEN
	RAISE exception 'Is already clocked in';
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_clockin_trigger ON ClockIn CASCADE;
CREATE TRIGGER check_clockin_trigger
	AFTER INSERT
	ON ClockIn
	FOR EACH ROW
	EXECUTE FUNCTION check_clockin();


CREATE OR REPLACE FUNCTION check_assigned_timing() RETURNS TRIGGER AS
$$
DECLARE
	next_order_id INTEGER;
BEGIN
	IF (select restaurantToCustomerTime from Assigned where NEW.oid = oid) is null and (select arriveAtCustomerTime from Assigned where NEW.oid = oid) is not null THEN
	RAISE exception 'Invalid time update';
	END IF;
	IF (select arriveAtRestaurantTime from Assigned where NEW.oid = oid) is null and 
		((select arriveAtCustomerTime from Assigned where NEW.oid = oid) is not null or 
		 (select restaurantToCustomerTime from Assigned where NEW.oid = oid) is not null) THEN
	RAISE exception 'Invalid time update';
	END IF;
	IF (select toRestaurantTime from Assigned where NEW.oid = oid) is null and 
		((select arriveAtCustomerTime from Assigned where NEW.oid = oid) is not null or 
		 (select restaurantToCustomerTime from Assigned where NEW.oid = oid) is not null or 
		 (select arriveAtRestaurantTime from Assigned where NEW.oid = oid) is not null) THEN
	RAISE exception 'Invalid time update';
	END IF;
	IF (select arriveAtCustomerTime from Assigned where NEW.oid = oid) is not null THEN
		IF (SELECT EXISTS (select 1 from OrderWaitingList where orderAssigned=false)) THEN
			next_order_id := (SELECT oid from OrderWaitingList where orderAssigned=false order by queueNum asc limit 1);
			INSERT INTO Assigned (oid, empid, commission)
			VALUES (next_order_id, NEW.empid, 10);
			UPDATE OrderWaitingList SET orderAssigned = TRUE WHERE oid = next_order_id;
			UPDATE ClockIn SET onDelivery = TRUE WHERE empid=NEW.empid and timeOut is null;
		ELSE
			UPDATE ClockIn SET onDelivery=false where empid=NEW.empid and timeout is null;
		END IF;
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE	plpgsql;

DROP TRIGGER IF EXISTS check_assigned_timing_trigger ON Assigned CASCADE;
CREATE TRIGGER check_assigned_timing_trigger
	AFTER UPDATE OR INSERT
	ON Assigned
	FOR EACH ROW
	EXECUTE FUNCTION check_assigned_timing();

CREATE OR REPLACE FUNCTION assign_order_clockin() RETURNS TRIGGER AS
$$
DECLARE
	next_order_id INTEGER;
BEGIN
	IF (SELECT EXISTS (select 1 from OrderWaitingList where orderAssigned=false)) THEN
		next_order_id := (SELECT oid from OrderWaitingList where orderAssigned=false order by queueNum asc limit 1);
		INSERT INTO Assigned (oid, empid, commission)
		VALUES (next_order_id, NEW.empid, 10);
		UPDATE OrderWaitingList SET orderAssigned = TRUE WHERE oid = next_order_id;
		UPDATE ClockIn SET onDelivery = TRUE WHERE empid=NEW.empid and timeOut is null;
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE	plpgsql;

DROP TRIGGER IF EXISTS assign_order_clockin_trigger ON ClockIn CASCADE;
CREATE TRIGGER assign_order_clockin_trigger
	AFTER INSERT
	ON ClockIn
	FOR EACH ROW
	EXECUTE FUNCTION assign_order_clockin();