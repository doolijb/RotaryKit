/**
 * This file is used to setup the test environment.
 */

import { beforeAll, beforeEach, afterAll, afterEach } from "vitest"
import { client } from "$server/database"

beforeAll(async () => {})

beforeEach(async () => {
    // Purge all data from the database
    await client.query(`
        DO $$ DECLARE
            r RECORD;
        BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
            END LOOP;
        END $$;
    `)
})

afterAll(async () => {})

afterEach(async () => {})