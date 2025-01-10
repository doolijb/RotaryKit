import type { ToastStore } from '@skeletonlabs/skeleton';
import {Toast} from './Toast';

/**
 * Returns a function that automatically handles form errors (if formErrors is provided),
 * toasts (if toastStore is provided), before executing an optional callback function
 */
export function handleClientError(
	{
		toastStore
	}: {
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