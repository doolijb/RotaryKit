import type { PageServerLoad } from './$types';

export const load = (async () => {
    return { title: "Change Passphrase" };
}) satisfies PageServerLoad;