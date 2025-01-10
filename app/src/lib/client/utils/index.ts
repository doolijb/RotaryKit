import type { ToastStore } from "@skeletonlabs/skeleton"
import { Toast } from "./Toast.ts"

export * from "./Toast.ts"
export * from "./hasAdminPermission.ts"
export * from "./useFormData.ts"
export * from "./differentiateType.ts"
export * from "./handleClientError.ts"

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
