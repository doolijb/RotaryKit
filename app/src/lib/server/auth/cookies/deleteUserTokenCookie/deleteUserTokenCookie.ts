import type { RequestEvent } from "@sveltejs/kit"

export default function deleteUserTokenCookie({event}: {event: RequestEvent}) {
    event.cookies.delete("userToken", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    })
}