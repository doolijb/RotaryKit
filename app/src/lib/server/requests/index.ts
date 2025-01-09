import crypto from "crypto"
export * from "./validateData"
export * from "./hasAdminPermission"

export * as adminApi from "./adminApi"

export function getShortHash(input: string, length = 8): string {
	const hash = crypto.createHash("sha256").update(input).digest("hex")
	return hash.substring(0, length)
}
