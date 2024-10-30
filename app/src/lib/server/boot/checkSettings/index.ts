import { logger } from "$server/logging"

/**
 * Check that all required environment variables are set
 */
export async function checkSettings({
	envDefaults = {
		USER_TOKEN_EXPIRATION_HOURS: "72"
	}
}: {
	envDefaults?: EnvDefaults
}) {
	logger.info("• Checking settings...")
	const envVars = [
		"APP_URL",
		"POSTGRES_USER",
		"POSTGRES_PASSWORD",
		"POSTGRES_DB",
		"POSTGRES_HOST",
		"POSTGRES_PORT",
		"CRYPTO_SECRET_SALT",
		"CRYPTO_SECRET_KEY",
		"USER_TOKEN_EXPIRATION_HOURS",
		"SMTP_HOST",
		"SMTP_PORT",
		"SMTP_USE_TLS",
		"SMTP_USER",
		"SMTP_PASSWORD",
		"SMTP_DISPLAY_NAME",
		"SMTP_FROM_ADDRESS",
		"STORAGE_ACCESS_KEY_ID",
		"STORAGE_SECRET_ACCESS_KEY",
		"STORAGE_DEFAULT_REGION",
		"STORAGE_DEFAULT_BUCKET",
		"STORAGE_PRIVATE_ENDPOINT",
		"STORAGE_PUBLIC_ENDPOINT"
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
