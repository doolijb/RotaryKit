import crypto from "crypto"

export { V3 as paseto } from "paseto"
export * from "./decryptLocalToken"
export * from "./generateLocalToken"

export const secretKey = crypto.createHash('sha256').update(process.env.SECRET_KEY).digest('base64').slice(0, 32)