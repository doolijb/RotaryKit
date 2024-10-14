import { migrate } from "$server/database";

export async function checkDatabase() {
    await migrate()
}