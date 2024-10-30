import axios from "axios"

/**
 * Query the maildev inbox
 */
export default async function queryInbox() {
	return await axios.get(`http://${process.env.SMTP_HOST}:1080/email`)
}
