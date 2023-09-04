async function featureTestFetch(path: string, options: RequestInit = {}): Promise<Response> {
	const baseUrl = "http://localhost:51204"
	const url = `${baseUrl}${path}`

	let contentType: string
	if (options.body instanceof FormData) {
		contentType = "multipart/form-data"
	} else {
		contentType = "application/json"
	}

	// Default headers
	const defaultHeaders = {
		Accept: "application/json, text/plain, */*",
		"Content-Type": contentType,
		credentials: "include"
	}

	// Merge default headers with any headers provided in options
	options.headers = {
		...defaultHeaders,
		...options.headers
	}

	const response = await fetch(url, options)
	return response
}

export { featureTestFetch as fetch }
