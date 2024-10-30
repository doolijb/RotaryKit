import type { ToastStore } from "@skeletonlabs/skeleton"
import { Toast } from "./Toast"

export * from "./Toast"
export * from "./hasAdminPermission"
export * from "./useFormData"
export * from "./differentiateType"

/**
 * Returns a function that automatically handles form errors (if formErrors is provided),
 * toasts (if toastStore is provided), before executing an optional callback function
 */
export function handleClientError(
	{
		toastStore
	}: {
		errors?: FormErrors
		toastStore?: ToastStore
	},
	callback?: (res: DefaultResponse) => Promise<any>
) {
	return (res: DefaultResponse) => {
		if (toastStore) {
			if (!res.body["message"]) {
				res.body["message"] = "An unknown error occurred"
			}
			toastStore.trigger(new Toast({ message: res.body["message"], style: "error" }))
		}
		if (callback) {
			return callback(res)
		} else {
			return res
		}
	}
}

/**
 * Returns a function that automatically handles toasts (if toastStore is provided),
 * before executing an optional callback function
 */
export function handleServerError(
	{
		toastStore
	}: {
		toastStore?: ToastStore
	},
	callback?: (res: DefaultResponse) => Promise<any>
) {
	return (res: DefaultResponse) => {
		if (toastStore) {
			const message = res.body["message"] || "An internal error occurred"
			toastStore.trigger(new Toast({ message, style: "error" }))
		}
		if (callback) {
			callback(res)
			return
		}
	}
}

/**
 * Returns a function that automatically handles toasts (if toastStore is provided),
 * before executing an optional callback function
 */
export function handleException(
	{
		toastStore
	}: {
		toastStore?: ToastStore
	},
	callback?: (err: any) => Promise<any>
) {
	return (err: any) => {
		if (toastStore) {
			const message = "An unexpected error occurred"
			toastStore.trigger(new Toast({ message, style: "error" }))
		}
		if (callback) {
			callback(err)
			return
		}
	}
}
