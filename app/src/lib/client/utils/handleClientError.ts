import type { ToastContext } from "@skeletonlabs/skeleton-svelte"

/**
 * Returns a function that automatically handles form errors (if formErrors is provided),
 * toasts (if toast is provided), before executing an optional callback function
 */
export function handleClientError(
	{
		toast
	}: {
		toast?: ToastContext
	},
	callback?: (res: DefaultResponse) => Promise<any>
) {
	return (res: DefaultResponse) => {
		if (toast) {
			if (!res.body["message"]) {
				res.body["message"] = "An unknown error occurred"
			}
			toast.create({ 
				title: "Error",
				description: res.body["message"], 
				type: "error" 
			})
		}
		if (callback) {
			return callback(res)
		} else {
			return res
		}
	}
}