import { logger } from "$server/logging"

/**
 * Check that all required environment variables are set
 */
export function checkSettings({
    envDefaults = {
        USER_TOKEN_EXPIRATION_HOURS: "72"
    }
}: {
    envDefaults?: EnvDefaults
}) {
    logger.info("• Checking settings...")
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

    envVars.forEach((envVar) => {
        if (process.env[envVar] === undefined) {
            if (envDefaults[envVar] !== undefined) {
                process.env[envVar] = envDefaults[envVar]
                logger.info(" ✔️\n")
                logger.info(`Setting default value for environment variable: ${envVar}`)
            } else {
                logger.warn(" ❌\n")
                logger.error(`Missing environment variable: ${envVar}`)
                process.exit(1)
            }
        }
    })
}