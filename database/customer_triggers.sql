
DROP TYPE OrderItemInput CASCADE;
CREATE TYPE OrderItemInput as (catid integer, catname text,
current_qty integer, description text, fid integer,
fname text, food_limit integer, notes text, price DECIMAL(10,2), qty integer, rid integer);

-- DROP FUNCTION submitOrder(integer, integer, Decimal(10,2), boolean, boolean,
-- Decimal(10,2), Decimal(10,2),text,text,integer,text) CASCADE;

CREATE OR REPLACE FUNCTION submitOrder(inUserId integer, inRid integer,
in_min_order_cost Decimal(10,2), in_use_credit_card boolean, in_use_points boolean,
inPrice Decimal(10,2), in_delivery_fee Decimal(10,2),
inAddress text, in_location_area text, in_gain_reward_pts integer,inOrderItems text, inPcid integer)
RETURNS void as $$
DECLARE
    meet_min_cost boolean;
    order_id integer;
    oiid_count integer := 1;
    temprow record;
    existTuple boolean;
BEGIN
    select true into meet_min_cost from Restaurants R where R.rid = inRid 
    and (inPrice - in_delivery_fee) < R.min_order_cost; 
    IF FOUND THEN
        RAISE exception 'Order does not meet restaurant minimum order cost';
    END IF;

    INSERT INTO Orders(use_credit_card, use_points, order_time,
    order_status, price, delivery_fee, address, location_area, cid, gain_reward_pts, rid)
    VALUES (in_use_credit_card, in_use_points, now(),
    'WAITING', inPrice, in_delivery_fee, inAddress, in_location_area, inUserId, in_gain_reward_pts,
    inRid)
    RETURNING oid INTO order_id;

    INSERT INTO OrderWaitingList(oid)
    VALUES (order_id);

    IF inPcid > 0 THEN
        SELECT true into existTuple FROM Eligible where pcid=inPcid and cid=inUserId;
        IF NOT FOUND THEN
            RAISE exception 'Not Eligible for the current promo';
        END IF;

        INSERT INTO OrderPromoCampaignUsage(oid, pcid)
        VALUES (order_id, inPcid);
    END IF;

    FOR temprow IN
        SELECT * FROM json_populate_recordset(null:: OrderItemInput, inOrderItems::json)
        LOOP
            INSERT INTO OrderItem(oiid, oid, qty, fid, notes_to_restaurant)
            VALUES (oiid_count, order_id, temprow.qty, temprow.fid, temprow.notes);
            oiid_count := oiid_count + 1; 
        END LOOP;
    
END;
$$ LANGUAGE plpgsql;

-- Customer triggers and functions -------

-- trigger for Order Insertion

CREATE OR REPLACE FUNCTION create_order_task() RETURNS TRIGGER AS $$
DECLARE
    inRewardPts integer;
BEGIN
    
    SELECT reward_pts into inRewardPts FROM Customers C WHERE cid = NEW.cid;

    IF NEW.use_points THEN

        INSERT INTO PointUsage(oid, point_used, used_on)
        VALUES (NEW.oid, inRewardPts, now());

        UPDATE Customers
        SET reward_pts = NEW.gain_reward_pts
        WHERE cid = NEW.cid;
    ELSE
        UPDATE Customers
        SET reward_pts = reward_pts + NEW.gain_reward_pts
        WHERE cid = NEW.cid;
    END IF;

    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS insert_order_task ON Orders CASCADE;
CREATE CONSTRAINT TRIGGER insert_order_task
AFTER INSERT
ON Orders
DEFERRABLE INITIALLY IMMEDIATE
FOR EACH ROW
EXECUTE FUNCTION create_order_task();


-- trigger for OrderItem Insertion

CREATE OR REPLACE FUNCTION create_orderitem_task() RETURNS TRIGGER AS $$
DECLARE
    inFid integer;
BEGIN
    
    SELECT fid into inFid FROM FoodItem WHERE fid = NEW.fid and (current_qty + NEW.qty) > food_limit;
    IF FOUND THEN
        RAISE exception 'The following order item is sold out : %', NEW.oiid;
    ELSE
        UPDATE FoodItem
        SET current_qty = current_qty + NEW.qty
        WHERE fid = NEW.fid;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS insert_orderitem_task ON OrderItem CASCADE;
CREATE CONSTRAINT TRIGGER insert_orderitem_task
AFTER INSERT
ON OrderItem
DEFERRABLE INITIALLY IMMEDIATE
FOR EACH ROW
EXECUTE FUNCTION create_orderitem_task();

-- trigger for OrderPromoCampaignUsage Insertion
-- this is to ensure that each order is only linked to one promocampaign

CREATE OR REPLACE FUNCTION insert_order_pc_check() RETURNS TRIGGER AS $$
DECLARE
    out_oid integer;
BEGIN
    
    SELECT oid INTO out_oid FROM OrderPromoCampaignUsage WHERE oid = NEW.oid and pcid <> NEW.pcid;

    IF FOUND THEN 
        RAISE exception 'Order has already applied PromoCampaign before';
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_key_constraint_order_pc_trigger ON OrderPromoCampaignUsage CASCADE;
CREATE CONSTRAINT TRIGGER check_key_constraint_order_pc_trigger
AFTER UPDATE OR INSERT
ON OrderPromoCampaignUsage
DEFERRABLE INITIALLY IMMEDIATE
FOR EACH ROW
EXECUTE FUNCTION insert_order_pc_check();

-- submit review

CREATE OR REPLACE FUNCTION submitReview(inOid integer, inDescription text, inRating smallint)
RETURNS void as $$
DECLARE
    found_oid integer;
    found_rating integer;
BEGIN
    
    SELECT oid into found_oid FROM RestaurantReview where oid=inOid;
    IF FOUND THEN
        UPDATE RestaurantReview
        SET description = inDescription;
    ELSE
        INSERT INTO RestaurantReview
        VALUES (inOid, inDescription);
    END IF;

    SELECT oid into found_rating FROM RiderRatings where oid=inOid;
    IF FOUND THEN
        UPDATE RiderRatings
        SET rating = inRating;
    ELSE
        INSERT INTO RiderRatings
        VALUES (inOid, inRating);
    END IF;
    
END;
$$ LANGUAGE plpgsql;




