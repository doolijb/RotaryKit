import type { Cookies, RouteData } from "@sveltejs/kit"

export class RequestEvent<FormData = Record<string, any> | undefined> implements RequestEvent {
	request: Request
	status: number
	url: URL | undefined
	locals: App.Locals
	params: Record<string, any>
	cookies: Cookies
	_cookies: { [key: string]: string }
	fetch: any = undefined
	getClientAddress(): string {
		return ""
	}
	platform = ""
	route: RouteData = {
		id: "",
		params: Object({}),
		parent: null,
		segment: "",
		pattern: new RegExp(""),
		layout: null,
		error: null,
		leaf: undefined,
		page: undefined,
		endpoint: undefined
	}
	isDataRequest = false
	isSubRequest = false

	constructor({
		body,
		headers = {},
		host = "localhost:51204",
		url = "http://localhost:51204/",
		params = {},
		searchParams = {},
		cookies = {},
		method = "GET",
		userAgent = {
			browser: {
				name: "firefox",
				version: "91.0"
			},
			os: {
				name: "ubuntu",
				version: "21.04"
			}
		},
		user = undefined
	}: {
		body?: FormData
		headers?: { [key: string]: string }
		host?: string
		url?: string
		user?: App.Locals["user"]
		params?: { [key: string]: string }
		searchParams?: { [key: string]: string }
		cookies?: { [key: string]: string }
		method?: string
		userAgent?: App.Locals["userAgent"]
	}) {
		this.locals = {
			user,
			userAgent
		}
		this.params = params || {}

		this._setCookies(cookies)
		this._setRequest(url, method, headers, searchParams, body, host)
	}

	private _setCookies(cookies) {
		this._cookies = cookies
		this.cookies = {
			get: (name: string) => this._cookies[name],
			set: (name: string, value: string, options?: any) => (this._cookies[name] = value),
			getAll: () => Object(this._cookies),
			delete: (name: string, options?: any) => delete this._cookies[name],
			serialize: (name: string, value: string, options?: any) => (this._cookies[name] = value)
		}
	}

	private _setRequest(url, method, headers, searchParams, body, host) {
		const requestOptions = {
			url: new URL(url || "", `http://${host}`),
			method: method,
			headers: headers,
			searchParams: searchParams,
			body: body ? JSON.stringify(body) : undefined
		}

		this.request = new Request(url.toString(), requestOptions)
	}

	public setHeaders(headers: { [key: string]: any }): void {
		Object.entries(headers).forEach(([key, value]) => {
			this.request.headers.set(key, value)
		})
	}
}
