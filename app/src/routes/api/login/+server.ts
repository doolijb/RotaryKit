import { createHandlers } from "@requests"
import type { RequestHandler } from "@sveltejs/kit"
import data from "."

const handlers: {[key:string]: RequestHandler} = createHandlers(data)

export const POST = handlers["POST"]
export const GET = handlers["GET"]
export const PUT = handlers["PUT"]
export const PATCH = handlers["PATCH"]
export const DELETE = handlers["DELETE"]
