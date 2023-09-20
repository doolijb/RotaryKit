import { getRequestData, validateData } from '@server'
import forms from '@validation/forms'
import { db, users, emails, userEmails } from '@server/database'
import type { IFormValidatorDefinition } from '@interfaces'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

/** @type {import('./$types').RequestHandler} */
export async function POST(event: { request: Request }) {

    // Get request data
    const data = await getRequestData(event.request)

    // Validate data
    const formValidators = forms.userRegistration({
        passphraseConf: {
            args: {
                confirmMatch: {
                    args: {
                        getMatchValue: () => data.passphrase,
                    }
                }
            }
        }
    } as unknown as IFormValidatorDefinition)
    validateData(data, formValidators)

    // Database validation
    const errors: { [key: string]: string[] } = {}

    // Check if username is taken
    const usernameTaken: boolean = Boolean(await db.query.users.findFirst({
        columns: {
            id: true,
        },
        where: eq(users.username, data.username)
    }))

    if (usernameTaken) {
        errors['username'] = ['Username is already taken']
    }

    // Check if email is taken
    const emailTaken: boolean = Boolean(await db.query.emails.findFirst({
        columns: {
            id: true,
        },
        where: eq(emails.address, data.email)
    }))

    if (emailTaken) {
        errors['email'] = ['Email is already taken']
    }

    // If errors, throw an error
    if (Object.keys(errors).length) {
        throw error(
            400,
            { ...errors } as any
        )
    }

    // Create user
    const user = (await db.insert(users).values({
        username: data.username,
    }).returning({ id: users.id }))[0]

    // Create email
    const email = (await db.insert(emails).values({
        address: data.email
    }).returning({ id: emails.id }))[0]

    // Create user email
    await db.insert(userEmails).values({
        userId: user.id,
        emailId: email.id,
        isPrimary: true,
    })

    // Create passphrase


    return new Response("Hello World")
}

function createPassphrase(userId: string, passphrase: string) {
    // Use PBKDF2, salt is randomly generated string + env var
    // Hash is 256 bits
    // Iterations is a random number within 1000 + or - of 100,000
    // Store hash, salt, and iterations in database
    // Return void

    const secretKey = process.env.SECRET_KEY!
    const salt = crypto.randomBytes(256 - secretKey.length).toString('hex')
    const iterations = Math.floor(Math.random() * 200000) + 100000
}