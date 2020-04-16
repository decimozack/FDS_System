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