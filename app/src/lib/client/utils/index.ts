import type { ToastStore } from "@skeletonlabs/skeleton"
import { Toast } from "./Toast"

export * from "./Toast"
export * from "./hasAdminPermission"

/**
 * Returns a function that automatically handles form errors (if formErrors is provided),
 * toasts (if toastStore is provided), before executing an optional callback function
 */
export function handleClientError({
    formErrors,
    toastStore,
}:{
    formErrors?: FormErrors,
    toastStore?: ToastStore,
}, callback?: <T = void>(res: DefaultResponse) => Promise<T>) {
    return (res: DefaultResponse) => {
        if (formErrors && res.body["errors"]) {
            formErrors = res.body["errors"] || formErrors
        }
        if (toastStore && res.body["message"]) {
            toastStore.trigger(
                new Toast({ message: res.body['message'], style: "warning" })
            )
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
export function handleServerError({
    toastStore,
}: {
    toastStore?: ToastStore,
}, callback?: <T = void>(res: DefaultResponse) => Promise<T>) {
    return (res: DefaultResponse) => {
        if (toastStore) {
            const message = res.body["message"] || "An internal error occurred"
            toastStore.trigger(
                new Toast({ message, style: "error" })
            )
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
export function handleException({
    toastStore,
}: {
    toastStore?: ToastStore,
}, callback?: <T = void>(err: any) => Promise<T>) {
    return (err: any) => {
        if (toastStore) {
            const message = "An unexpected error occurred"
            toastStore.trigger(
                new Toast({ message, style: "error" })
            )
        }
        if (callback) {
            return callback(res)
        } else {
            return res
        }
    }
}