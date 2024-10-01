import { db, schema } from "$server/database"
import { send } from "$server/emails"
import { EmailLogTypes } from "$shared/constants"
import nodemailer from "nodemailer"
import { PassphraseResetCode } from "$client/emailTemplates"

/**
 * Creates a passphrase reset code if a valid one does not already exist,
 * and sends it to the user's email address. If a toAddress is provided,
 * it must belong to the user and be verified.
 * 
 * @param {typeof db} args.tx - The database transaction. Defaults to `db`.
 * @param {string} args.userId - The user id that the request is for.
 * @param {string} args.toAddress - The email address to send the code to, optional.
 * @returns {Promise<string>} Email address the code was sent to.
 * 
 * @example
 * import { emails } from "$server/providers"
 * 
 * await emails.verification.sendCode({ emailId: emailId })
 */
export async function sendCode({
    tx=db,
    userId,
    toAddress,
    // TODO: Add validation options to save on db queries
}: {
    tx?: typeof db,
    userId: string,
    toAddress: string,
}): Promise<string> {

    const subject = "Passphrase Reset"

    // Check if there is already a code
    let result = await getResult(tx, userId)
    // 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // If there is a code, use it or create a new one
    if (!result) {
        await tx.insert(schema.passphraseResets).values({
            userId,
            expiresAt
        }).returning({
            code: schema.passphraseResets.id,
        })

        // Get our complete result
        result = await getResult(tx, userId)
    }

    // Get our variables ready
    const code = result.id

    // If emailAddress is not provided, find one
    if (!toAddress) {

        // Look for the primary
        result.user.emails.forEach((email: SelectEmail) => {
            if (email.isUserPrimary) {
                toAddress = email.address
            }
        })
        // If no primary, use the first
        if (!toAddress) {
            toAddress = result.user.emails[0].address
        }

    } else {

        // If emailAddress is provided, make sure it belongs to the user
        let found = false
        result.user.emails.forEach((email: SelectEmail) => {
            if (email.address === toAddress) {
                found = true
            }
        })

        // If not found, throw an error
        if (!found) {
            throw "Email address does not belong to user"
        }
    }

    const url = process.env.APP_URL + "/reset/passphrase/" + code

    await send({
        subject,
        to: toAddress,
        template: PassphraseResetCode,
        args: {
            url,
            name: result.user.username,
            expiresAt: expiresAt ?  Number.parseInt(expiresAt.getTime().toString()) : undefined,
            subject
        },
        type: EmailLogTypes.PASSPHRASE_RESET
    })

    return toAddress
}

async function getResult(tx, userId) {
    return await tx.query.passphraseResets.findFirst({
        where: (r, {eq, isNull, gt, and}) => and(
            eq(r.userId, userId), 
            isNull(r.consumedAt),
            gt(r.expiresAt, new Date()), // TODO: Check if expired compared to now
        ),
        with: {
            user: {
                with: {
                    emails: true
                }
            }
        }
    })
}