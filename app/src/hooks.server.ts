import chalk from 'chalk'
import { migrate } from "@server/database"
import { error } from "@sveltejs/kit"
import type { Event, Resolve } from "@sveltejs/kit/types/hooks"
import { db } from "@server/database"
import { exists } from 'drizzle-orm'

chalk.level = 1

await startUp()

export async function handle({ event, resolve }: { event: Event; resolve: Resolve }) {
    const response = await resolve(event)
    return response
}


// Perform general safety checks and tasks
async function startUp() {
    const startupText = "Starting up... "
    console.log(chalk.green(startupText))

    await migrate()
    checkSettings()

    console.log(chalk.green("READY!\n"))
}

// Check that all required environment variables are set
function checkSettings() {
    process.stdout.write(chalk.green("• ") + chalk.yellow('Checking settings...'))
    const envVars = [
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_DB',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'SERVER_TYPE',
        'SECRET_KEY',
    ]

    envVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            process.stdout.write(chalk.red(" ❌\n"))
            console.log(chalk.red(`Missing environment variable: ${envVar}`))
            process.exit(1)
        }
    })
}