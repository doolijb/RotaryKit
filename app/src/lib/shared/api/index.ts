import type { APIRoutes } from "$src/api.d"
import { createAPIProxy } from "sveltekit-zero-api/client"

const proxy = createAPIProxy() as APIRoutes

const api = proxy.api

export default api
