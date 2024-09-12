import { defineConfig } from "drizzle-kit"

export const dbCredentials = {
    host: process.env.POSTGRES_HOST as string,
    port: Number(process.env.POSTGRES_PORT) as number,
    database: process.env.NODE_ENV === "test" ? "test" : process.env.POSTGRES_DB as string,
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
}

export function getConnectionString(dbCredentials: {host:string, port:number, database:string, user:string, password:string}) {
    const { host, port, database, user, password } = dbCredentials
    return `postgres://${user}:${password}@${host}:${port}/${database}`
}

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/lib/server/database/schema/!(*.test|index).ts",
    out: "./src/lib/server/database/migrations",
    dbCredentials: {
        url: getConnectionString(dbCredentials),
    },
})

