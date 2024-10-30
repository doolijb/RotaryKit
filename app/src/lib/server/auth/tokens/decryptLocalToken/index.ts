import { tokens } from "$server/auth"

export async function decryptLocalToken({
	token
}: {
	token: string
}): Promise<Record<string, unknown>> {
	return await tokens.paseto.decrypt(token, tokens.secretKey)
}
