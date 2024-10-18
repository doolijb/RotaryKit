import {
	seeds
} from "$server/database"
import { logger } from "$server/logging"
import { checkDatabase } from "./checkDatabase"

import { checkObjectStorage } from "./checkObjectStorage"
import { checkSettings } from "./checkSettings"

/**
 * Perform any necessary boot-up tasks
 */
export async function boot({
    envDefaults = undefined
}: {
    envDefaults?: EnvDefaults
}) {
    logger.info("Starting up... ")

    await checkSettings({envDefaults})
    await checkDatabase()
    await checkObjectStorage()

    try {
        seeds.adminPermissions()
    } catch (e) {
        logger.error({ message: e.message, stack: e.stack })
    }

    logger.info("READY!\n")
}

