import { schema, db } from "$server/database"
import crypto from "crypto"
import { users } from "$server/providers"
import type { QueryResult } from "pg"
import { eq } from "drizzle-orm"

/**
 * Create a new passphrase for a user and store it in the database
 * 
 * @param tx 
 * @param userId 
 * @param passphrase 
 * @param createOnly - If true, will not delete any existing passphrases for this user, i.e. user was just created
 */
export async function set({
    tx = db,
    userId,
    passphrase,
    createOnly=false,
    returning,
}:{
    tx?: typeof db,
    userId: string,
    passphrase: string,
    createOnly?: boolean,
    returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {
    // Use PBKDF2, salt is randomly generated string + env var
    // Hash is 256 bits
    // Iterations is a random number within 1000 + or - of 100,000
    // Store hash, salt, and iterations in database
    const salt = crypto.randomBytes(256 - process.env.SECRET_SALT.length).toString("hex");
    const iterations = Math.floor(Math.random() * 200000) + 100000;
  
    const hashedPassphrase = await users.passphrase.encrypt({
        passphrase,
        salt,
        iterations
    })

    // Delete any existing passphrases for this user if createOnly is false
    !createOnly && await tx.delete(schema.passphrases).where(eq(schema.passphrases.userId, userId))
          
    // Store hash, salt, and iterations in database
    const query = tx.insert(schema.passphrases).values({
        userId,
        hash: hashedPassphrase,
        salt: salt,
        iterations: String(iterations),
    })

    // Returning?
    if (returning) {
        query.returning(returning)
    }

    // Return result
    return await query
  }