import { fetch } from "$shared/testing"
import api from "$shared/api"

export default async function loginUser({
	email,
	passphrase
}: {
	email: string
	passphrase: string
}): Promise<string> {
	/**
	 * Login
	 */
	const response = await api.login.POST(
		{
			body: {
				email,
				passphrase
			}
		},
		fetch
	)

	/**
	 * Get the cookies
	 */
	const cookies = response.headers["set-cookie"]
	if (!cookies) {
		throw new Error("No cookies were set")
	}

	return cookies.join(";")
}
