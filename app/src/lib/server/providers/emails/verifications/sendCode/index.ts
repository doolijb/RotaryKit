import { db, schema } from "$server/database"
import { eq } from "drizzle-orm"
import { send } from "$server/emails"
import { EmailLogTypes } from "$shared/constants"
import { EmailVerificationCode } from "$client/emailTemplates"

/**
 * Creates an email validation code if one does not already exist,
 * and sends it to the email address.
 *
 * @param {typeof db} args.tx - The database transaction. Defaults to `db`.
 * @param {string} args.emailId - The email id to send the code to.
 * @returns {Promise<void>} The results of args.returning, or void.
 *
 * @example
 * import { emails } from "$server/providers"
 *
 * await emails.verification.sendCode({ emailId: emailId })
 */
export async function sendCode({
	tx = db,
	emailId,
	username = null,
	expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24)
}: {
	tx?: typeof db
	emailId: string
	username?: string
	expiresAt?: Date | null
}): Promise<void> {
	let code: string
	const subject = "Email Verification"

	// Check if there is already a code
	const result = await tx.query.emailVerifications.findFirst({
		where: (v, { and, eq, isNull, gte, or }) =>
			and(
				eq(v.emailId, emailId),
				isNull(v.verifiedAt),
				or(isNull(v.expiresAt), gte(v.expiresAt, new Date())),
				isNull(v.expiresAt)
			),
		with: {
			email: true
		}
	})

	// If there is a code, use it or create a new one
	if (result) {
		code = result.id
		// Update the expiration date
		await tx
			.update(schema.emailVerifications)
			.set({
				expiresAt
			})
			.where(eq(schema.emailVerifications.id, code))
	} else {
		// Create a new code
		;[{ code }] = await tx
			.insert(schema.emailVerifications)
			.values({
				emailId,
				expiresAt
			})
			.returning({
				code: schema.emailVerifications.id
			})
	}

	const [{ toAddress }] = await tx
		.select({
			toAddress: schema.emails.address
		})
		.from(schema.emails)
		.where(eq(schema.emails.id, emailId))
		.limit(1)

	const transportConfig = {
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT),
		secure: process.env.NODE_ENV === "production"
	}

	if (process.env.SMTP_USER || process.env.SMTP_PASSWORD) {
		transportConfig["auth"] = {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD
		}
	}

	const url = process.env.APP_URL + "/verify/email/" + code

	await send({
		subject,
		to: toAddress,
		template: EmailVerificationCode,
		args: {
			url,
			name: username,
			expiresAt: expiresAt.getTime(),
			subject
		},
		type: EmailLogTypes.EMAIL_VERIFICATION
	})
}
