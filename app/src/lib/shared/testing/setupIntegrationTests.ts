import { beforeAll, beforeEach, afterAll, afterEach } from "vitest"
import { client } from "$server/database"

let transactionId: string

beforeAll(async () => {
	// // Purge all data from the database
	// await client.query(`
	//     DO $$ DECLARE
	//         r RECORD;
	//     BEGIN
	//         -- Disable all triggers
	//         SET session_replication_role = 'replica';
	//         FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
	//             EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
	//         END LOOP;
	//         -- Re-enable all triggers
	//         SET session_replication_role = 'origin';
	//     END $$;
	// `)
})

beforeEach(async () => {
	// // Start a new transaction before each test
	// transactionId = `test_${Math.random()}`;
	// await client.query(`BEGIN; SET LOCAL my.transaction_id = '${transactionId}';`);
})

afterEach(async () => {
	// // Roll back the transaction after each test
	// await client.query(`ROLLBACK;`);
})

afterAll(async () => {
	// // Close the database connection after all tests have run
	// await client.end();
})
