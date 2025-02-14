import type { ToastSettings } from "@skeletonlabs/skeleton"

export class Toast implements ToastSettings {
	constructor({
		message,
		style = "surface",
		autohide = true,
		timeout = 5000,
		action,
		callback
	}: {
		message: ToastSettings["message"]
		style?: "surface" | "primary" | "secondary" | "tertiary" | "success" | "warning" | "error"
		autohide?: ToastSettings["autohide"]
		timeout?: ToastSettings["timeout"]
		action?: ToastSettings["action"]
		callback?: ToastSettings["callback"]
	}) {
		this.message = message
		this.autohide = autohide
		this.timeout = timeout
		this.hideDismiss = autohide
		this.action = action
		this.callback = callback

		// Fixed settings
		this.hoverable = true
		this.classes = "rounded-container-token text-surface-50"
		this.background = `variant-filled-${style}`
	}
	message: ToastSettings["message"]
	background?: ToastSettings["background"]
	autohide?: ToastSettings["autohide"]
	timeout?: ToastSettings["timeout"]
	action?: ToastSettings["action"]
	hideDismiss?: ToastSettings["hideDismiss"]
	hoverable?: ToastSettings["hoverable"]
	classes?: ToastSettings["classes"]
	callback?: ToastSettings["callback"]
	zIndex: 5000
}
