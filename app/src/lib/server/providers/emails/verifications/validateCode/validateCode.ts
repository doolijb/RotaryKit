import { messageError } from "$requests"
import { db, schema } from "$database"
import { eq, isNull, gt, and } from "drizzle-orm"

/**
 * Validate an email verification code.
 * 
 * @param {typeof db} args.tx - The database transaction to use.
 * @param {string} args.code - The code to validate.
 * @param {boolean} args.propagate - Whether to propagate validation of the email address to the user's account.
 * @returns {Promise<void>}
 */
export default async function validateCode({
    tx=db,
    code,
    propagate=false,
}: {
    tx?: typeof db,
    code: string,
    propagate?: boolean,
}): Promise<SelectEmailVerification | void> {
    const emailVerification = await tx.query.emailVerifications.findFirst({
        where: (v, {and, eq, isNull, or}) => and(
            eq(v.id, code) ,
            isNull(v.verifiedAt),
            or(
                isNull(v.expiresAt),
                gt(v.expiresAt, new Date())
            ),
        ),
        with: {
            email: {
                with: {
                    user: true
                }
            },
        },
    })

    if (!emailVerification) {
        return
    }

    const verifiedAt = new Date()

    // Update the email verification record
    await tx.update(schema.emailVerifications).set({
        verifiedAt,
    }).where(eq(schema.emailVerifications.id, code))

    // Update the email record
    await tx.update(schema.emails).set({
        verifiedAt,
    }).where(eq(schema.emails.id, emailVerification.emailId))

    // Propagate the validation
    if (propagate) {
        // Update the user record
        if (emailVerification.email.user && emailVerification.email.user.verifiedAt === null) {
            await tx.update(schema.users).set({
                verifiedAt,
            }).where(and(
                eq(schema.users.id, emailVerification.email.user.id)
                && isNull(schema.users.verifiedAt)
            ))
        }
    }

    return emailVerification
}