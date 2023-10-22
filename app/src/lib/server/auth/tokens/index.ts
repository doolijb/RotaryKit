import crypto from "crypto"
import { V3 as paseto } from "paseto"
import { default as authenticateUser } from "./authenticateUser"
import { default as decryptLocalToken } from "./decryptLocalToken"
import { default as expireAllUserTokens } from "./expireAllUserTokens"
import { default as expireUserToken } from "./expireUserToken"
import { default as generateLocalToken } from "./generateLocalToken"

const PASETO_SECRET_KEY = process.env.PASETO_SECRET_KEY || "Hello World" // TODO
const secretKey = crypto.createHash('sha256').update(PASETO_SECRET_KEY).digest('base64').substr(0, 32)

export default {
    secretKey,
    paseto, // Rexport Paseto so we can control the version from one place
    authenticateUser,
    decryptLocalToken,
    expireAllUserTokens,
    expireUserToken,
    generateLocalToken
}