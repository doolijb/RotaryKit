/**
 * Lets create a global logger for our server using winston
 */

import type { RequestEvent } from "@sveltejs/kit"
import chalk from "chalk";
import { createLogger, format, transports } from "winston"

Error.stackTraceLimit = 1000

const { printf } = format

const appFormat = printf(({ level, message, timestamp, error, event }:{
    level: "info" | "warn" | "debug",
    message: string,
    timestamp: string,
    error: undefined,
    event?: RequestEvent
} | {
    level: "error",
    message: string,
    timestamp: string,
    error: Error,
    event?: RequestEvent
}) => {

    if (level === "error" && !error) {
        logger.warn("Error log without an error object")
    }

    const colorizer = format.colorize();
    const coloredLevel = colorizer.colorize(level, level.toUpperCase());

    let location = '';
    if (error && error.stack) {
        const stackLines = error.stack.split('\n');
        if (stackLines.length > 1) {
            location = stackLines[1].trim(); // Extract the first line of the stack trace
        }
    }

    return `${timestamp} ${coloredLevel}: ${message} ${location ? `\nLocation: ${location}` : ""} ${error ? `\n${error.stack}` : ""} ${
        event ? `\n${JSON.stringify(event, null, 2)}` : ""
    }`
});

// Create a logger
const baseLogger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }), // Ensure stack trace is included
        appFormat
    ),
    transports: [new transports.Console()],
})

// Lets add a global error handler
export function handleException(error: Error, event?: RequestEvent) {
    logger.error(error.message, { 
        error, 
        // event
    })
}

export const logger = {
    info: baseLogger.info.bind(baseLogger),
    warn: baseLogger.warn.bind(baseLogger),
    error: baseLogger.error.bind(baseLogger),
    debug: baseLogger.debug.bind(baseLogger),
    exception: handleException,
    resolvedRequest: (event: RequestEvent, response: Response) => {
        console.log(response)
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