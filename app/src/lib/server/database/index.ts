// import { exists } from "drizzle-orm"
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { migrate as pgMigrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'
import chalk from "chalk"
import { schema, relations } from "./schema"
import { dbCredentials } from "./config"
import seeds from "./seeds"
import utils from "$database/utils"

import pgtools from "pgtools"

chalk.level = 1

export function getConnectionString(dbCredentials: {host:string, port:number, database:string, user:string, password:string}) {
    const { host, port, database, user, password } = dbCredentials
    return `postgres://${user}:${password}@${host}:${port}/${database}`
}

export const client = new pg.Client({ connectionString: getConnectionString(dbCredentials) })

/**
 * If the client fails to connect, try to create the database and connect again.
 * Useful for when testing, or the database has been changed.
 */
async function handleClientConnection() {
    try {
        await client.connect()
    } catch (error) {
        await client.end()
        await pgtools.createdb(dbCredentials, client.database)
        await client.connect()
    }
}

await handleClientConnection()
await migrate()

export async function migrate() {
    
    const db = drizzle(client, {
        logger: false,
        schema: {
            ...schema,
            ...relations
        },
    })

    return await pgMigrate(db, {
        migrationsFolder: './src/lib/server/database/migrations',
    }).catch((err) => {
        console.error("ERROR", err)
        process.exit(1)
    }).then(() => {
        return
    })
}

const db = drizzle(client, {
    schema: {
        ...schema,
        ...relations
    },
})

export {
    db, 
    schema,
    relations,
    dbCredentials,
    seeds,
    utils,
}