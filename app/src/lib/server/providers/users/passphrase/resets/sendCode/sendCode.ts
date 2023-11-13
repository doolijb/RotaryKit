import { db, schema } from "@database"
import { eq, isNull, gt, and } from "drizzle-orm"
import { PassphraseResetCode } from "@components"
import { render } from "svelte-email"
import nodemailer from "nodemailer"
import { env } from "process"
import { messageError } from "@requests"

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
 * import { emails } from "@providers"
 * 
 * await emails.verification.sendCode({ emailId: emailId })
 */
export default async function sendCode({
    tx=db,
    userId,
    toAddress,
}: {
    tx?: typeof db,
    userId: string,
    toAddress: string,
}): Promise<string> {

    const subject: string = "Passphrase Reset"

    // Check if there is already a code
    let result = await getResult(tx, userId)

    // If there is a code, use it or create a new one
    if (!result) {
        await tx.insert(schema.passphraseResets).values({
            userId,
            // 1 hour from now
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        }).returning({
            code: schema.passphraseResets.id,
        })

        // Get our complete result
        result = await getResult(tx, userId)
    }

    // Get our variables ready
    const code = result.id
    const username = result.user.username
    const expiresAt = result.expiresAt

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
            throw messageError("Email address does not belong to user")
        }
    }

    const transportConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.NODE_ENV === "production",
    }

    if (process.env.SMTP_USER || process.env.SMTP_PASSWORD) {
        transportConfig["auth"] = {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        }
    }

    // Send the code
    const transporter = nodemailer.createTransport(transportConfig)

    const url = process.env.APP_URL + "/passphrase/reset/" + code

    const html = render({
        template: PassphraseResetCode, 
        props: {
            url,
            username,
            expiresAt,
            subject
        } 
    })

    const options = {
        from: `"${process.env.SMTP_DISPLAY_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
        to: toAddress,
        subject,
        html,
    }

    await transporter.sendMail(options).catch((error) => {
        console.error(error)
        throw error
    })

    return toAddress
}

async function getResult(tx, userId) {
    return await tx.query.passphraseResets.findFirst({
        where: and(
            eq(schema.passphraseResets.userId, userId), 
            isNull(schema.passphraseResets.consumedAt),
            gt(schema.passphraseResets.expiresAt, new Date()), // TODO: Check if expired compared to now
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