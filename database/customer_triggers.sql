
drop type test_type CASCADE;
create type test_type as (a int, b int);
-- Check existing email for user creation
drop function testing(text) CASCADE;
CREATE OR REPLACE FUNCTION testing(inJson text)
-- RETURNS setof test_type as $$
RETURNS text as $$
DECLARE
    outTest text;
BEGIN
    RAISE NOTICE '%', inJson;
    RAISE exception '% is already existing in the login table', 'test';
    select a into outTest from json_populate_recordset(null:: test_type, inJson::json);
    return a;
    -- return query select * from json_populate_recordset(null:: test_type, inJson::json);
    -- return outTest;
END;
$$ LANGUAGE plpgsql;


-- drop function createOrder(text) CASCADE;
-- CREATE OR REPLACE FUNCTION testing(inJson text)
-- RETURNS setof test_type as $$
-- DECLARE
--     outTest text;
-- BEGIN
--     RAISE NOTICE '%', inJson;
--     return query select * from json_populate_recordset(null:: test_type, inJson::json);
--     -- return outTest;
-- END;
-- $$ LANGUAGE plpgsql;

