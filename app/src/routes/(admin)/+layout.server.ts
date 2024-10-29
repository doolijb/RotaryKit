import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
    // Add request.user to data
    // Add request.userAgent to data

    // if (!locals.user) {
    //     redirect(302, "/login");
    // }

    // if (!locals.user.isAdmin && !locals.user.isSuperUser) {
    //     redirect(302, "/");
    // }

    return {
        APP_VERSION: process.env.npm_package_version,
    }
}