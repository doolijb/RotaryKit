export async function load({ locals }) {
    return {
        user: locals.user,
        adminPermissions: locals.adminPermissions,
    }
}