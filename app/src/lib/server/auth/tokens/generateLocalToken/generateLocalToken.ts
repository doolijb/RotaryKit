import { tokens } from "@auth"

export default async function generateLocalToken({payload}: {payload: Record<string, unknown>}): Promise<string> {
    return await tokens.paseto.encrypt(payload, tokens.secretKey, { expiresIn: "1h" })
}