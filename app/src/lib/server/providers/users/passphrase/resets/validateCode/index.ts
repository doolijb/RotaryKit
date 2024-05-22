import { db } from "$server/database"

/**
 * Checks if a passphrase reset code is valid and if the user is eligible.
 * No mutations are made to the database.
 * 
 * @param {typeof db} args.tx - The database transaction. Defaults to `db`.
 * @param {string} args.code - The passphrase reset id to check.
 * @returns {Promise<Record<string, any>>} Nothing. Throws an error if the code is invalid.
 */
export async function validateCode({
    tx=db,
    code,
}: {
    tx?: typeof db
    code: string
}) { // TODO: Fix this type

    /**
     * Get result
     */
    const result: SelectPassphraseReset & {
        user: SelectUser
    } = await tx.query.passphraseResets.findFirst({
        where: (r, {and, eq, isNull, gt}) => and(
            eq(r.id, code),
            isNull(r.consumedAt),
            gt(r.expiresAt, new Date()), // TODO: Check if expired compared to now
        ),
        with: {
            user: true,
        },
    }).catch((e) => {
		// If invalid input syntax, then just return undefined
		if (e.message.includes("invalid input syntax")) {
			return undefined
		}
		throw e
	})


    if (!result || !result.user.verifiedAt || !result.user.isActive) {
        throw "Invalid passphrase reset code."
    }

    return result
}