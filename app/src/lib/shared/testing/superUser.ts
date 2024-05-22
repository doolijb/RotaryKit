import { users, emails } from "$server/providers"
import { db, schema } from "$server/database"

const data = {
    username: "superUser",
    email: "super.user@example.com",
    passphrase: "$Om3p4$$phr4$3",
}

async function create({
    tx=db,
    isVerified=true,
}:{
    tx?: typeof db,
    isVerified?: boolean,
} = {
}) {
    const [{userId}] = await users.create({
        tx, 
        username: data.username, 
        isVerified,
        isSuperUser: true,
        returning:{
            userId: schema.users.id
        }
    })
    await users.passphrase.set({
        tx,
        userId,
        passphrase: data.passphrase,
        createOnly: true
    })
    await emails.create({
        tx,
        userId,
        address: data.email,
        isVerified,
        isUserPrimary: true,
    })
}

export const superUser = {
    data,
    create,
}