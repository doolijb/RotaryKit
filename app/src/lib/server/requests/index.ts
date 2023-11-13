export { JsonResponse } from "./response"
export { error } from "@sveltejs/kit"
export { default as customFieldError } from "./customFieldError"
export { default as messageError } from "./messageError"
export { default as validateForm } from "./validateForm"

import { JsonResponse } from "./response"
import type { RequestEvent, RequestHandler } from "@sveltejs/kit"



export function createHandlers(data: {[key:string]: Function}): {
    "POST"?: RequestHandler | undefined,
    "GET"?: RequestHandler | undefined,
    "PUT"?: RequestHandler | undefined,
    "PATCH"?: RequestHandler | undefined,
    "DELETE"?: RequestHandler | undefined,
} {
	const handlers = {}
	Object.keys(data).forEach(method => {
		const status = 200
		switch (method) {
			case "POST":
				handlers[method] = async (event: RequestEvent) => await JsonResponse({data:await data[method](event), status:201})
				break
			case "GET":
				handlers[method] = async (event: RequestEvent) => await JsonResponse({data:await data[method](event), status:200})
				break
			case "PUT":
				handlers[method] = async (event: RequestEvent) => await JsonResponse({data:await data[method](event), status:200})
				break
			case "PATCH":
				handlers[method] = async (event: RequestEvent) => await JsonResponse({data:await data[method](event), status:200})
				break
			case "DELETE":
				handlers[method] = async (event: RequestEvent) => await JsonResponse({data:await data[method](event), status:200})
				break
			default:
				throw new Error(`Unknown method: ${method}`)
		}
	})
	return handlers
}