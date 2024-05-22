import { db } from "$server/database"
// import { PassphraseUpdatedConfirmation } from "$client/components"

    // TODO: Switch to react-email, this lib is dead
    /// https://github.com/carstenlebek/svelte-email/issues/25
    // import { render } from "svelte-email"
    // const render = undefined

import nodemailer from "nodemailer"

/**
 * Sends a simple email notification to the user's primary email that a user's passphrase has been changed.
 * 
 * @param {typeof db} args.tx - The database transaction. Defaults to `db`.
 * @param {string} args.userId - The user id that the request is for.
 * @returns {void} Nothing.
 */
export async function notifyChange({
    tx=db,
    userId,
}: {
    tx?: typeof db,
    userId: string,
}): Promise<void> {

    const subject = "Passphrase Updated"

    // Check if there is already a code
    const user = await tx.query.users.findFirst({
        where: (u, {eq}) => eq(u.id, userId),
        with: {
            emails: {
                where: (e, {eq}) => eq(e.isUserPrimary, true),
            }
        }
    })

    // const name = user.username
    const toAddress = user.emails[0].address
    const transportConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.NODE_ENV === "production",
    }

    // Send the code
    const transporter = nodemailer.createTransport(transportConfig)

    // const html = render({
    //     template: PassphraseUpdatedConfirmation, 
    //     props: {
    //         name,
    //         subject
    //     } 
    // })

    const options = {
        from: `"${process.env.SMTP_DISPLAY_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
        to: toAddress,
        subject,
        html: ""// html,
    }

    await transporter.sendMail(options).catch((error) => {
        console.error(error)
        throw error
    })
}