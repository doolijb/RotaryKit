
/**
 * Lets create a global logger for our server using winston
 */

import type { RequestEvent } from "@sveltejs/kit"
import chalk from "chalk";
import { createLogger, format, transports } from "winston"

const { printf } = format

const appFormat = printf(({ level, message, timestamp, error, event }:{
    level: string,
    message: string,
    timestamp: string,
    error?: Error,
    event?: RequestEvent
}) => {
    const colorizer = format.colorize();
    const coloredLevel = colorizer.colorize(level, level.toUpperCase());

    return `${timestamp} ${coloredLevel}: ${message} ${error ? `\n${error.stack}` : ""} ${
        event ? `\n${JSON.stringify(event, null, 2)}` : ""
    }`
});

// Create a logger
const baseLogger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        appFormat
    ),
    transports: [new transports.Console()],
})

// Lets add a global error handler
export function handleException(error: Error, event?: RequestEvent) {
    logger.error(error.message, { error, event })
}

export const logger = {
    info: baseLogger.info.bind(baseLogger),
    warn: baseLogger.warn.bind(baseLogger),
    error: baseLogger.error.bind(baseLogger),
    debug: baseLogger.debug.bind(baseLogger),
    exception: handleException,
    resolvedRequest: (event: RequestEvent, response: Response) => {
        logger.info(`[${styledMethod(event.request.method)}] ${event.request.url} ${styledStatus(response.status)}`)
    }
}

const styledMethod = (method: string) => {
    // style the method for the console
    if (method === "GET") return chalk.green(method)
    if (method === "POST") return chalk.blue(method)
    if (method === "PUT") return chalk.yellow(method)
    if (method === "DELETE") return chalk.red(method)
    return method
}

const styledStatus = (status: number) => {
    // style the status code for the console
    if (status >= 500) return chalk.red(status)
    if (status >= 400) return chalk.yellow(status)
    if (status >= 300) return chalk.cyan(status)
    if (status >= 200) return chalk.green(status)
    return status
}
