import chalk from "chalk"
import { schema, migrate, db, seeds } from "@database"
import { tokens, cookies } from "@auth"
import { UAParser } from "ua-parser-js"
import type {  RequestEvent } from "@sveltejs/kit"
import { users } from "@providers"
import getLogger from "pino"
import sanitizeHtml from "sanitize-html"

chalk.level = 1
const logger = getLogger()

await startUp()

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ event, resolve }) {
    // try {
    //     seeds.adminPermissions()
    // } catch (e) {
    //     console.log(e)
    // }

    // const testPerformance = false // event.request.method !== "HEAD" && process.env.NODE_ENV !== "production"
    // const startTime = testPerformance ? performance.now() : undefined

    // Handle Authentication
    await handleAuthentication(event)

    // Get Request Data
    event.locals.data = await requestData(event.request)
    
    let resolved

    try {
        resolved = await resolve(event)
    } catch (error) {
        logger.error(error)
        throw error
    }

    // if(testPerformance) {
    //     const endTime = performance.now()
    //     const executionTime = endTime - startTime
    //     console.log(chalk.green(`[${event.request.method}] ${event.request.url} - ${executionTime}ms`))
    // }

    return resolved
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
    process.stdout.write(chalk.green("• ") + chalk.yellow("Checking settings..."))
    const envVars = [
        "APP_URL",
        "POSTGRES_HOST",
        "POSTGRES_PORT",
        "POSTGRES_DB",
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "SECRET_KEY",
        "SECRET_SALT",
        "USER_TOKEN_EXPIRATION_HOURS",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USE_TLS",
        "SMTP_USER",
        "SMTP_PASSWORD",
        "SMTP_DISPLAY_NAME",
        "SMTP_FROM_ADDRESS",
    ]

    const envDefaults = {
        USER_TOKEN_EXPIRATION_HOURS: "72", // Default to 3 days
    }

    envVars.forEach((envVar) => {
        if (process.env[envVar] === undefined) {
            if (envDefaults[envVar] !== undefined) {
                process.env[envVar] = envDefaults[envVar]
                process.stdout.write(chalk.green(" ✔️\n"))
                console.log(chalk.green(`Setting default value for environment variable: ${envVar}`))
            } else {
                process.stdout.write(chalk.red(" ❌\n"))
                console.log(chalk.red(`Missing environment variable: ${envVar}`))
                process.exit(1)
            }
        }
    })
}

export async function requestData(request: Request): Promise<{ [key: string]: string }> {
    let data: { [key: string]: any } = {}

    if (request.headers.get('content-type')?.includes('form')) {
        // Form Data
        const formData = await request.formData()
        for (const [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                // Sanitize the input to prevent XSS attacks
                data[key] = sanitizeHtml(value.trim())
            }
        }
    } else if (request.headers.get('content-type')?.includes('json')) {
        // JSON
        const jsonData = await request.json()
        // Sanitize each value in the JSON data
        data = Object.fromEntries(
            Object.entries(jsonData).map(([key, value]) => 
                [key, typeof value === 'string' ? sanitizeHtml(value) : value]
            )
        );
    } else {
        return data
    }

    return data
}

async function handleAuthentication(event: RequestEvent) {
    // Get Parsed User Agent
    event.locals.userAgent = new UAParser(event.request.headers.get("user-agent")).getResult()

    // Get User Token
    const token = event.cookies.get("userToken")
    // Authenticate User
    if (token) {
        try {
            const validToken = await tokens.decryptLocalToken({token})
            event.locals.userTokenId = validToken.id as string
            const authenticatedData = await users.auth.authenticate({
                tokenId: validToken.id as string,
                token: token,
                userAgent: event.locals.userAgent,
                validate: true,
            })
            event.locals.user = authenticatedData.user
            event.locals.adminPermissions = authenticatedData.adminPermissions
        } catch (e) {
            cookies.deleteUserTokenCookie({event})
            console.log("handle: error", e)
        }
    }
}