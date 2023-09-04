import { exists } from "drizzle-orm"
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { migrate as pgMigrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'
import chalk from "chalk"
import * as schema from "@server/database/schema"
export * from "@server/database/schema"

chalk.level = 1

export const databases = {
    default: {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    }
}

export function getConnectionString(settings: typeof databases.default) {
    const { host, port, database, user, password } = settings
    return `postgres://${user}:${password}@${host}:${port}/${database}`
}

const client = new pg.Client({ connectionString: getConnectionString(databases.default) })
await client.connect()

export async function migrate() {
    const migrateText = "Updating database..."
    process.stdout.write(chalk.whiteBright('• ') + chalk.yellow(migrateText))
    process.stdout.cursorTo(migrateText.length + 4)

    const db = drizzle(client, { schema })

    return pgMigrate(db, {
        migrationsFolder: './src/lib/server/database/migrations',
    }).catch((err) => {
        process.stdout.write("❌")
        console.log(err)
        process.exit(1)
    }).then(() => {
        process.stdout.write(chalk.green("🗸\n"))
        return
    })
}

export const db: NodePgDatabase<typeof schema> = drizzle(client, { schema })