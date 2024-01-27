import type { RequestEvent } from "@sveltejs/kit"

export function setUserTokenCookie({event, token}: {event: RequestEvent, token: string}) {
    event.cookies.set("userToken", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    })
}