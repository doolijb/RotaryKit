import { db, schema } from "@database"
import { eq } from 'drizzle-orm'
import crypto from 'crypto'
import Template from "./Template.svelte"
import { renderMail } from 'svelte-mail';

import { forms, utils } from "@validation"
import { error } from "@sveltejs/kit"

function getForm({getPassphrase}): FormValidator {
    return utils.formValidator({
        definitions: forms.userRegister,
        extras: {
            passphraseConfirm: {
                matches: {
                    args: {
                        getValue: getPassphrase,
                    }
                }
            }
        }
    })
}

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {

    // Validate data
    const formValidator: FormValidator = getForm({
        getPassphrase: () => event.locals.data.passphrase,
    })
    const errors: FormErrors = await formValidator.test(event.locals.data)

    if (Object.keys(errors).length) {
        throw error(400, {
            message: "There were errors with your submission",
            errors: errors,
        })
    }

    // Check if username is taken
    const usernameTaken: boolean = Boolean(await db.query.users.findFirst({
        columns: {
            id: true,
        },
        where: eq(
            schema.users.username, 
            event.locals.data.username
            )
    }))

    if (usernameTaken) {
        errors.username ??= {};
        errors.username.unavailable = "This username is already in use"
    }

    // Check if email is taken
    const emailTaken: boolean = Boolean(await db.query.emails.findFirst({
        columns: {
            id: true,
        },
        where: eq(
            schema.emails.address, 
            event.locals.data.email
            )
    }))

    if (emailTaken) {
        errors.email ??= {};
        errors.email.unavailable = "This email is already in use"
    }

    if (Object.keys(errors).length) {
        throw error(400, {
            message: "There were errors with your submission",
            errors,
        })
    }


    const { user, email } = await db.transaction(async (tx) => {

        // Create user
        const user = (await tx.insert(schema.users).values({
            username: event.locals.data.username,
        }).returning({ id: schema.users.id }))[0]

        // Create email
        const email = (await tx.insert(schema.emails).values({
            address: event.locals.data.email
        }).returning({ id: schema.emails.id }))[0]

        // Create user email
        await tx.insert(schema.userEmails).values({
            userId: user.id,
            emailId: email.id,
            isPrimary: true,
        })

        await createPassphrase(
            tx, 
            user.id, 
            event.locals.data.passphrase
            )

        return { user, email }
    })

    // Create passphrase
    // TODO
    // sendMail()
    return new Response("Success")
}

async function createPassphrase(db, userId: string, passphrase: string) {
    // Use PBKDF2, salt is randomly generated string + env var
    // Hash is 256 bits
    // Iterations is a random number within 1000 + or - of 100,000
    // Store hash, salt, and iterations in database
    // Return void
    const secretKey = process.env.SECRET_KEY!;
    const salt = crypto.randomBytes(256 - secretKey.length).toString("hex");
    const iterations = Math.floor(Math.random() * 200000) + 100000;
  
    const hashedPassphrase = await new Promise<string>((resolve, reject) => {
      crypto.pbkdf2(
        passphrase,
        salt,
        iterations,
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

    console.log("hash length", hashedPassphrase.length)
  
    // Store hash, salt, and iterations in database
    await db.insert(schema.passphrases).values({
        userId: userId,
        hash: hashedPassphrase,
        salt: salt,
        iterations: iterations,
        })
  
    // Return void
  }

//   async function sendMail() {
//     const { html, text } = await renderMail(Template, { data: { } })
//     sendMail()
//     .catch(console.error)
//   }