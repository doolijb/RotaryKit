import type { PageServerLoad } from './$types';

export const load = (async () => {
    return { title: "Email Addresses" };
}) satisfies PageServerLoad;