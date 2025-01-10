import { drizzle } from "drizzle-orm/node-postgres"
import { migrate as pgMigrate } from "drizzle-orm/node-postgres/migrator"
import pg from "pg"
import { schema, relations } from "./schema"
import { dbCredentials, getConnectionString } from "./config"
import seeds from "./seeds"
import utils from "./utils"

import pgtools from "pgtools"
import { logger } from "$server/logging"
import { sql } from "drizzle-orm"

export const client = new pg.Client({ connectionString: getConnectionString(dbCredentials) })

/**
 * If the client fails to connect, try to create the database and connect again.
 * Useful for when testing, or the database has been changed.
 */
async function handleClientConnection() {
	try {
		await client.connect()
	} catch (error) {
		logger.error(error)
		// await client.end()
		// if (["development", "test"].includes(process.env.NODE_ENV)) {
		// 	const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbCredentials.database])
		// 	if (res.rowCount === 0) {
		// 		await pgtools.createdb(dbCredentials, client.database)
		// 	}
		// 	await client.connect()
		// } else {
		// 	logger.info({ message: "Database connection failed, skipping", error: error })
		// }
	}
}

await handleClientConnection()

export async function migrate() {
	const db = drizzle(client, {
		logger: false,
		schema: {
			...schema,
			...relations
		}
	})

	return await pgMigrate(db, {
		migrationsFolder: "./src/lib/server/database/migrations"
	})
		.catch((e) => {
			logger.error({ message: e.message, error: e })
			process.exit(1)
		})
		.then(() => {
			return
		})
}

const db = drizzle(client, {
	schema: {
		...schema,
		...relations
	}
})

export { db, schema, relations, dbCredentials, seeds, utils }
