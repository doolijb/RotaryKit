import { migrate } from "$server/database"
import { logger } from "$server/logging"

export async function checkDatabase() {
	logger.info("• Updating database...")
	await migrate()
}
