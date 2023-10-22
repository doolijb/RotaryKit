import { db, schema } from '@database'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'
import { tokens, cookies } from "@auth"
import { v4 as uuid } from "uuid"

import { forms, utils } from "@validation"
import { error } from "@sveltejs/kit"

function getForm(): FormValidator {
    return utils.formValidator({
        definitions: forms.userLogin,
    })
}

/** @type {import('./$types').Actions} */
export async function POST(event) {

    // Validate data
    const formValidator: FormValidator = getForm()
    const errors: FormErrors = await formValidator.test(
        event.locals.data
        )

    if (Object.keys(errors).length) {
        throw error(400, {
            message: "There were errors with your submission",
            errors: errors,
        })
    }

    // Find the user
    const user = await db.query.users.findFirst({
        with: {
            passphrase: true,
        },
        where: eq(schema.users.username, event.locals.data.username)
        }
    )

    if (!user) {
        throw error(400, {
            message: "Invalid username or passphrase",
        })
    }

    // Validate the hash
    const hash = await new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(
            event.locals.data.passphrase,
            user.passphrase.salt,
            parseInt(user.passphrase.iterations),
            256,
            "sha256",
            (err, derivedKey) => {
                if (err) {
                reject(err);
                } else {
                resolve(derivedKey.toString("hex"));
                }
            }
        )
    })

    if (hash !== user.passphrase.hash) {
        throw error(400, {
            message: "Invalid username or passphrase",
        })
    }

    // Generate token
    const tokenId = uuid()

    const token = await tokens.generateLocalToken({
            payload: {
            sub: "user",
            id: tokenId,
        }
    })

    console.log("token", token)

    await db.insert(schema.userTokens).values({
        id: tokenId,
        userId: user.id,
        token,
        browser: event.locals.userAgent.browser.name,
        os: event.locals.userAgent.os.name,
    })

    // return token as a secure cookie
    cookies.setUserTokenCookie({event, token})

    // Return success
    return new Response(JSON.stringify({
        message: "Success",
    }), {
        status: 201,
        headers: {
            "Content-Type": "application/json",
        },
    })
}