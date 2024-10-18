export async function load({ locals }) {
    const { STORAGE_PUBLIC_ENDPOINT } = process.env
    const storageUrl = STORAGE_PUBLIC_ENDPOINT

    return {
        user: locals.user,
        adminPermissions: locals.adminPermissions,
        storageUrl,
    }
}