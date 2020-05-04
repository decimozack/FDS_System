-- Check existing email for user creation
CREATE OR REPLACE FUNCTION emailUserExist(inEmail text)
RETURNS boolean as $$
BEGIN
    RETURN EXISTS(SELECT 1 FROM LoginTable LT WHERE LT.email=inEmail);    
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION check_exist_email_constraint_deferred() RETURNS TRIGGER AS $$
DECLARE
    inEmail text;
BEGIN
    SELECT lt2.email INTO inEmail
    FROM LoginTable lt, LoginTable lt2
    WHERE lt.email = NEW.email and lt2.email = NEW.email and lt.userid = NEW.cid and lt2.userid <> NEW.cid;
    IF inEmail IS NOT NULL THEN 
        RAISE exception '% is already existing in the login table', NEW.email;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_user_trigger ON Customers CASCADE;
CREATE CONSTRAINT TRIGGER create_user_trigger
AFTER UPDATE OF email OR INSERT
ON Customers
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION check_exist_email_constraint_deferred();


-- trigger for FDSEmployee

CREATE OR REPLACE FUNCTION check_exist_email_emp_constraint_deferred() RETURNS TRIGGER AS $$
DECLARE
    inEmail text;
BEGIN
    SELECT lt2.email INTO inEmail
    FROM LoginTable lt, LoginTable lt2
    WHERE lt.email = NEW.email and lt2.email = NEW.email and lt.userid = NEW.empid and lt2.userid <> NEW.empid;
    IF inEmail IS NOT NULL THEN 
        RAISE exception '% is already existing in the login table', NEW.email;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_user_emp_trigger ON FDSEmployee CASCADE;
CREATE CONSTRAINT TRIGGER create_user_emp_trigger
AFTER UPDATE OF email OR INSERT
ON FDSEmployee
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION check_exist_email_emp_constraint_deferred();

-- insert into rider or manager

CREATE OR REPLACE FUNCTION insert_into_child_emp() RETURNS TRIGGER AS $$

BEGIN
    IF NEW.emptype = 'Manager' THEN
        INSERT INTO MANAGER VALUES (NEW.empid);
    ELSE
        INSERT INTO RIDER(empid, isPartTime) VALUES (NEW.empid, true);
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS insert_create_emp_trigger ON FDSEmployee CASCADE;
CREATE TRIGGER insert_create_emp_trigger
AFTER INSERT
ON FDSEmployee
FOR EACH ROW
EXECUTE FUNCTION insert_into_child_emp();

-- update emp and rider or manager

CREATE OR REPLACE FUNCTION update_child_emp() RETURNS TRIGGER AS $$

BEGIN
    IF NEW.emptype <> OLD.emptype THEN
        IF OLD.emptype = 'Manager' THEN
            DELETE FROM MANAGER
            WHERE empid = OLD.empid;

            INSERT INTO RIDER(empid, isPartTime, wid) VALUES (NEW.empid, true, 1);
        ELSE
            DELETE FROM RIDER
            WHERE empid = OLD.empid;
            INSERT INTO MANAGER VALUES (NEW.empid);
        END IF;

    ELSE
        IF OLD.emptype = 'Manager' THEN
            UPDATE Manager
            SET empid = NEW.empid
            WHERE empid = OLD.empid;
        
        ELSE
            UPDATE RIDER
            SET empid = NEW.empid
            WHERE empid = OLD.empid;
        END IF;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_emp_trigger ON FDSEmployee CASCADE;
CREATE TRIGGER update_emp_trigger
AFTER UPDATE OF empid, emptype
ON FDSEmployee
FOR EACH ROW
EXECUTE FUNCTION update_child_emp();


-- update rider
CREATE OR REPLACE FUNCTION updateRider(inEmail text, inFirstName text, inLastName text, inPassword text, inEmpId integer, inIsPartTime boolean)
RETURNS void as $$
BEGIN
    UPDATE FDSEmployee 
    SET email=inEmail, emp_first_name=inFirstName, emp_last_name=inLastName, emppassword=inPassword
    WHERE empid = inEmpId;
    UPDATE Rider
    SET isPartTime = inIsPartTime
    WHERE empid = inEmpId;
END;
$$ LANGUAGE plpgsql;

 DROP FUNCTION IF EXISTS getmonthsummary(integer,integer);
-- get month summary
CREATE OR REPLACE FUNCTION getMonthSummary(inYear integer,inMonth integer)
RETURNS TABLE (
    t_year double precision,
    t_month double precision,
    customerCount bigint,
    orderCount bigint,
    totalPrice DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY 
    SELECT case
    WHEN TC.t_year IS NOT NULL THEN TC.t_year
    ELSE TOM.t_year
    end as t_year, case 
    WHEN TC.t_month IS NOT NULL THEN TC.t_month
    ELSE TOM.t_month
    end as t_month, coalesce(TC.customerCount, 0), coalesce(TOM.orderCount,0), coalesce(TOM.totalPrice,0) 
    FROM TotalNewCustomerMonth TC full join TotalOrderMonth TOM 
    on TC.t_year = TOM.t_year and TC.t_month = TOM.t_month
    WHERE (TC.t_year = inYear and TC.t_month = inMonth) or
    (TOM.t_year = inYear and TOM.t_month = inMonth);
END;
$$ LANGUAGE plpgsql;

-- fdsAddDiscountPromo
CREATE OR REPLACE FUNCTION fdsAddDiscountPromo(startTime TIMESTAMP, endTime TIMESTAMP,
minSpend INTEGER, maxSpend INTEGER, inDiscount INTEGER)
RETURNS void as $$
DECLARE
    re_pcid INTEGER;
BEGIN
    INSERT INTO PromoCampaign(campaign_type, start_time, end_time)
    VALUES ('DiscountPromo', startTime, endTime) RETURNING pcid INTO re_pcid;

    INSERT INTO PromoBFDS
    VALUES (re_pcid);

    INSERT INTO DiscountPromo(pcid, min_spend, max_spend, discount)
    VALUES (re_pcid, minSpend, maxSpend, inDiscount);

END;
$$ LANGUAGE plpgsql;

-- Update Promo
CREATE OR REPLACE FUNCTION fdsUpdateDiscountPromo(startTime TIMESTAMP, endTime TIMESTAMP,
minSpend INTEGER, maxSpend INTEGER, inDiscount INTEGER, in_pcid INTEGER)
RETURNS void as $$
DECLARE
    re_pcid INTEGER;
BEGIN
    UPDATE PromoCampaign
    SET start_time=startTime, end_time=endTime
    WHERE pcid=in_pcid;
    
    UPDATE DiscountPromo
    SET min_spend=minSpend, max_spend=maxSpend, discount=inDiscount
    WHERE pcid=in_pcid;

END;
$$ LANGUAGE plpgsql;


-- trigger for FDSEmployee

CREATE OR REPLACE FUNCTION update_insert_discount_promo_restrict() RETURNS TRIGGER AS $$
BEGIN
    
    IF NEW.min_spend > NEW.max_spend THEN 
        RAISE exception 'Minimum Spend is more than Maximum spend';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_insert_discount_promo ON DiscountPromo CASCADE;
CREATE CONSTRAINT TRIGGER update_insert_discount_promo
AFTER UPDATE OF max_spend,min_spend OR INSERT
ON DiscountPromo
DEFERRABLE INITIALLY IMMEDIATE
FOR EACH ROW
EXECUTE FUNCTION update_insert_discount_promo_restrict();