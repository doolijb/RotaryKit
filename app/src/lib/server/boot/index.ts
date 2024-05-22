import { migrate, seeds } from "$server/database"
import { checkSettings } from "./checkSettings"
import { logger } from "$server/logging"

/**
 * Perform any necessary boot-up tasks
 */
export async function boot({
    envDefaults = undefined
}: {
    envDefaults?: EnvDefaults
}) {
    const startupText = "Starting up... "
    logger.info(startupText)

    await migrate()
    checkSettings({envDefaults})

    try {
        seeds.adminPermissions()
    } catch (e) {
        logger.error({ message: e.message, stack: e.stack })
    }

    logger.info("READY!\n")
}

