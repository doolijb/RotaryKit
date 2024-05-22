/**
 * Collection of testing utilities
 */

import { client } from "$server/database"

// export { default as deepCompare } from "./deepCompare"
export * from "./axios"
export * from "./basicUser"
export * as superUser from "./superUser"
// export { default as queryInbox } from "./queryInbox"
// export { default as loginUser } from "./loginUser"
// export * from "./RequestEvent"

export async function clearDB() {
    await client.query(`
        DO $$ DECLARE
            r RECORD;
        BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
            END LOOP;
        END $$;
    `)
}