import { PassphraseUpdatedConfirmation } from "$client/emailTemplates"
import { db } from "$server/database"
import { send } from "$server/emails"
import { EmailLogTypes } from "$shared/constants"

/**
 * Sends a simple email notification to the user's primary email that a user's passphrase has been changed.
 *
 * @param {typeof db} args.tx - The database transaction. Defaults to `db`.
 * @param {string} args.userId - The user id that the request is for.
 * @returns {void} Nothing.
 */
export async function notifyChange({
	tx = db,
	userId
}: {
	tx?: typeof db
	userId: string
}): Promise<void> {
	const subject = "Passphrase Updated"

	// Check if there is already a code
	const user = await tx.query.users.findFirst({
		where: (u, { eq }) => eq(u.id, userId),
		with: {
			emails: {
				where: (e, { eq }) => eq(e.isUserPrimary, true)
			}
		}
	})

	// const name = user.username
	const toAddress = user.emails[0].address

	await send({
		subject,
		to: toAddress,
		template: PassphraseUpdatedConfirmation,
		args: {
			name: user.username,
			subject
		},
		type: EmailLogTypes.PASSPHRASE_CHANGED
	})
}
