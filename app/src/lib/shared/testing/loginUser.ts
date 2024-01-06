import { users } from "$providers"
import { axios } from "$testing"

export default async function loginUser({
    username,
    passphrase,
}: {
    username: string,
    passphrase: string,
}): Promise<string> {
    
    /**
     * Login
     */
    const response = await axios.post("/api/login", {
        username,
        passphrase,
    })

    /**
     * Get the cookies
     */
    const cookies = response.headers["set-cookie"]
    if (!cookies) {
        throw new Error("No cookies were set")
    }

    return cookies.join(";")
}