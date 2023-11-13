import type { Config } from "drizzle-kit"

export const dbCredentials = {
    host: process.env.POSTGRES_HOST as string,
    port: Number(process.env.POSTGRES_PORT) as number,
    database: process.env.NODE_ENV === "test" ? "test" : process.env.POSTGRES_DB as string,
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
}

export default {
    schema: "./src/lib/server/database/schema/!(*.test|index).ts",
    out: "./src/lib/server/database/migrations",
    driver: "pg",
    dbCredentials,
} satisfies Config

