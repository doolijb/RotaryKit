import { db, schema } from "@database"
import { eq, isNotNull } from "drizzle-orm"
import { error } from "@sveltejs/kit"
import { cookies } from "@auth"
import type { RequestEvent } from "@sveltejs/kit"
import { users } from "@providers"

/**
 * Validates user credentials and generates a token and cookie.
 * Authenticates the user for the event.
 * 
 * @param tx
 * @param event
 * @param username
 * @param passphrase
 */
export default async function login({
    tx=db,
    event,
    username,
    passphrase,
}: {
    tx?: DbTransaction | typeof db,
    event: RequestEvent,
    username: string,
    passphrase: string,
}): Promise<void> {
    // Find the user
    const user = await tx.query.users.findFirst({
        with: {
            passphrase: true,
        },
        where: eq(schema.users.username, username) && isNotNull(schema.users.verifiedAt)
        }
    )

    if (!user) {
        throw error(400, {
            message: "Invalid username or passphrase",
        })
    }

    // Validate the hash
    const hash = await users.passphrase.encrypt({
        passphrase,
        salt: user.passphrase.salt,
        iterations: user.passphrase.iterations,
    })

    if (hash !== user.passphrase.hash) {
        throw error(400, {
            message: "Invalid username or passphrase",
        })
    }

    // Generate token
    const [{token}] = await users.tokens.create({
        tx,
        event,
        userId: user.id,
        returning: {
            token: schema.userTokens.token, // add token to the returning object
        }
    })

    // return token as a secure cookie
    cookies.setUserTokenCookie({event, token})
}