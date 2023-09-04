import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
import { databases, getConnectionString } from "./src/lib/server/database"

// get environment variables from .env file
if (!process.env.POSTGRES_HOST) {
    dotenv.config({
        path: "../.env.dev"
    })
}

const user = process.env.POSTGRES_USER
const password = process.env.POSTGRES_PASSWORD
const host = process.env.POSTGRES_HOST
const port = process.env.POSTGRES_PORT
const database = process.env.POSTGRES_DB

export default {
    schema: "./src/lib/server/database/schema",
    out: "./src/lib/server/database/migrations",
    driver: "pg",
    dbCredentials: {
        host: process.env.POSTGRES_HOST as string,
        port: Number(process.env.POSTGRES_PORT) as number,
        database: process.env.POSTGRES_DB as string,
        user: process.env.POSTGRES_USER as string,
        password: process.env.POSTGRES_PASSWORD as string,
    }
} satisfies Config

