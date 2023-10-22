import { tokens } from "@auth"

export default async function decryptLocalToken({token}: {token: string}): Promise<Record<string, unknown>> {
    return await tokens.paseto.decrypt(token, tokens.secretKey)
}