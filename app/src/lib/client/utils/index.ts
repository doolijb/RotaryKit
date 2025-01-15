import type { ToastContext } from "@skeletonlabs/skeleton-svelte"

export * from "./hasAdminPermission.ts"
export * from "./useFormData.ts"
export * from "./differentiateType.ts"
export * from "./handleClientError.ts"

/**
 * Returns a function that automatically handles toasts (if toast is provided),
 * before executing an optional callback function
 */
export function handleServerError(
	{
		toast
	}: {
		toast?: ToastContext
	},
	callback?: (res: DefaultResponse) => Promise<any>
) {
	return (res: DefaultResponse) => {
		if (toast) {
			const description = res.body["message"] || "An internal error occurred"
			toast.create({
				title: "Error",
				description,
				type: "error"
			})
		}
		if (callback) {
			callback(res)
			return
		}
	}
}

/**
 * Returns a function that automatically handles toasts (if toast is provided),
 * before executing an optional callback function
 */
export function handleException(
	{
		toast
	}: {
		toast?: ToastContext
	},
	callback?: (err: any) => Promise<any>
) {
	return (err: any) => {
		if (toast) {
			const description = "An unexpected error occurred"
			toast.create({
				title: "Error",
				description,
				type: "error"
			})
		}
		if (callback) {
			callback(err)
			return
		}
	}
}
