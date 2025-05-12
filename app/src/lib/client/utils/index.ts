import { toaster } from "./toaster.ts"

export * from "./hasAdminPermission.ts"
export * from "./useFormData.ts"
export * from "./differentiateType.ts"
export * from "./handleClientError.ts"
export * from "./toaster.ts"

/**
 * Returns a function that automatically handles toasts (if toast is provided),
 * before executing an optional callback function
 */
export function handleServerError(
	{
		toast
	}: {
		toast?: {title?: string, description?: string}
	},
	callback?: (res: DefaultResponse) => Promise<any>
) {
	return (res: DefaultResponse) => {
		toaster.error({ 
			title: toast && toast.title ? toast.title : "Error", 
			description: toast && toast.description ? toast.description : "An internal error occurred"
		})
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
		toast?: {title?: string, description?: string}
	},
	callback?: (err: any) => Promise<any>
) {
	return (err: any) => {
		toaster.error({ 
			title: toast && toast.title ? toast.title : "Error", 
			description: toast && toast.description ? toast.description : "An unexpected error occurred"
		})
		if (callback) {
			callback(err)
			return
		}
	}
}
