import axios from "axios"

/*
 * Axios instance with defaults for testing api
 */
export default axios.create({
    baseURL: "http://localhost:9998",
    headers: {
        // Browser user agent
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0 Safari/537.36",
        // OS user agent
        "X-User-Agent": "Linux x86_64",
    },
    withCredentials: true
})
