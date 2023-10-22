import chalk from "chalk"
import { migrate } from "@database"
import { tokens, cookies } from "@auth"
import { UAParser } from "ua-parser-js"
import { error } from "@sveltejs/kit"

chalk.level = 1

await startUp()

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ event, resolve }) {
    
    // Get Parsed User Agent
    event.locals.userAgent = new UAParser(event.request.headers.get("user-agent")).getResult()

    // Get User Token
    const token = event.cookies.get("userToken")

    // Authenticate User
    if (token) {
        try {
            const validToken = await tokens.decryptLocalToken({token})
            event.locals.userTokenId = validToken.id as string
            event.locals.user = await tokens.authenticateUser({
                tokenId: validToken.id as string,
                token: token,
                userAgent: event.locals.userAgent,
                validate: true,
            })

            if (!event.locals.user) {
                cookies.deleteUserTokenCookie({event})
            }
        } catch (e) {
            cookies.deleteUserTokenCookie({event})
            console.log("handle: error", e)
        }
    }

    // Get Request Data
    event.locals.data = await requestData(event.request)

    // Return Response
    return await resolve(event)
}


// Perform general safety checks and tasks
async function startUp() {
    const startupText = "Starting up... "
    console.log(chalk.green(startupText))

    // await migrate()
    checkSettings()

    console.log(chalk.green("READY!\n"))
}

// Check that all required environment variables are set
function checkSettings() {
    process.stdout.write(chalk.green("• ") + chalk.yellow("Checking settings..."))
    const envVars = [
        "POSTGRES_HOST",
        "POSTGRES_PORT",
        "POSTGRES_DB",
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "SERVER_TYPE",
        "SECRET_KEY",
        // "PASETO_SECRET_KEY", // TODO
    ]

    envVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            process.stdout.write(chalk.red(" ❌\n"))
            console.log(chalk.red(`Missing environment variable: ${envVar}`))
            process.exit(1)
        }
    })
}

export async function requestData(request: Request): Promise<{ [key: string]: string }> {
    let data: { [key: string]: string } = {}

    if (request.headers.get('content-type')?.includes('form')) {
        // Form Data
        const formData = await request.formData()
        for (const [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                data[key] = value.trim()
            }
        }
    } else if (request.headers.get('content-type')?.includes('json')) {
        // JSON
        data = await request.json()
    } else {
        return data
    }

    return data
}