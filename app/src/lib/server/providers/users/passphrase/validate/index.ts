import { schema, db } from "$server/database"
import { users } from "$server/providers"

/**
 * Create a new passphrase for a user and store it in the database
 *
 * @param tx
 * @param userId
 * @param passphrase
 */
export async function validate({
	tx = db,
	userId,
	passphrase
}: {
	tx?: DbTransaction | typeof db
	userId: string
	passphrase: string
}): Promise<boolean> {
	// Query database for user's passphrase
	const res = await tx.query.passphrases.findFirst(schema.passphrases, {
		userId,
		invalidatedAt: null
	})
	if (!res) return false

	// Encrypt passphrase with salt and iterations from database
	const hash = await users.passphrase.encrypt({
		passphrase,
		salt: res.salt,
		iterations: parseInt(res.iterations)
	})

	// Compare encrypted passphrase with hash from database
	return hash === res.hash
}
