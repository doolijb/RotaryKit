export async function load({ locals }) {
	const { 
		STORAGE_PUBLIC_ENDPOINT, 
		STORAGE_FORCE_PATH_STYLE, 
		STORAGE_DEFAULT_BUCKET 
	} = process.env

	function prependBucket(url) {
		const split = url.split('://')
		const protocol = split[0]
		const path = split[1]
		const bucket = STORAGE_DEFAULT_BUCKET
		return `${protocol}://${bucket}.${path}`
	}
	
	const storageUrl = STORAGE_FORCE_PATH_STYLE === "true" ? STORAGE_PUBLIC_ENDPOINT : prependBucket(STORAGE_PUBLIC_ENDPOINT)

	return {
		user: locals.user,
		adminPermissions: locals.adminPermissions,
		storageUrl
	}
}
