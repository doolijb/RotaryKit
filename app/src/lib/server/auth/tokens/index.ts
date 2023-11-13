import crypto from "crypto"
import { V3 as paseto } from "paseto"
import { default as authenticateUser } from "../../providers/users/auth/authenticate"
import { default as decryptLocalToken } from "./decryptLocalToken"
import { default as expireAllUserTokens } from "../../providers/users/tokens/expireAll"
import { default as expireUserToken } from "../../providers/users/tokens/expire"
import { default as generateLocalToken } from "./generateLocalToken"

const secretKey = crypto.createHash('sha256').update(process.env.SECRET_KEY).digest('base64').slice(0, 32)

export default {
    secretKey,
    paseto, // Rexport Paseto so we can control the version from one place
    authenticateUser,
    decryptLocalToken,
    expireAllUserTokens,
    expireUserToken,
    generateLocalToken
}