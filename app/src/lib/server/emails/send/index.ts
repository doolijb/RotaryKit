import { logger } from "$server/logging"
import nodemailer from "nodemailer"
import { db, schema } from "$server/database"
import type { EmailLogTypes } from "$shared/constants"
import { render } from "@react-email/render"
import { eq } from "drizzle-orm"
import React from "react"

export async function send<T extends React.ComponentType<any>>({
	subject,
	to,
	template,
	args,
	type
}: {
	subject: string
	to: string | string[]
	template: T
	args: React.ComponentProps<T>
	type: typeof EmailLogTypes.Options
}): Promise<void> {
	logger.info("send", { subject, to, template, args })

	const transportConfig = {
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT),
		secure: process.env.SMTP_USE_SECURE === "true",
		logger: process.env.SMTP_DEBUG === "true",
		debug: process.env.SMTP_DEBUG === "true"
	}

	if (process.env.SMTP_USER || process.env.SMTP_PASSWORD) {
		transportConfig["auth"] = {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD
		}
	}

	const transporter = nodemailer.createTransport(transportConfig)

	const toEmailAddresses = typeof to === "string" ? [to] : to

	const emailLogs: InsertEmailLog[] = []

	for (const toEmailAddress of toEmailAddresses) {
		const emailLog: InsertEmailLog = {
			type,
			recipientEmailAddress: toEmailAddress,
			parameters: args,
			html: ""
		}

		////
		// POPULATE THE LOG
		////

		await db
			.select({
				id: schema.emails.id,
				userId: schema.emails.userId
			})
			.from(schema.emails)
			.where(eq(schema.emails.address, toEmailAddress))
			.limit(1)
			.then(async (rows) => {
				// Assign the email id and user id to the log
				if (rows.length > 0) {
					emailLog.recipientEmailId = rows[0].id
					emailLog.recipientUserId = rows[0].userId
					// Get the user's username
					await db
						.select({ id: schema.users.id, username: schema.users.username })
						.from(schema.users)
						.where(eq(schema.users.id, rows[0].userId))
						.limit(1)
						.then((rows) => {
							if (rows.length > 0) {
								emailLog.recipientUserName = rows[0].username
							}
						})
				}
			})

		try {
			const component = React.createElement(template, args)
			const html = render(component)
			emailLog.html = html

			const options = {
				from: `"${process.env.SMTP_DISPLAY_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
				to: toEmailAddress,
				subject,
				html
			}

			await transporter.sendMail(options)

			emailLog.success = true
		} catch (e) {
			emailLog.success = false
			emailLog.html = e.message
			logger.error(e)
		}

		emailLogs.push(emailLog)
	}

	await db.insert(schema.emailLogs).values(emailLogs)
}
