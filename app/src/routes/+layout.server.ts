export async function load({ locals }) {
    // Add request.user to data
    // Add request.userAgent to data

    return {
        user: locals.user || null,
    }
}