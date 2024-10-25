/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description Function to convert an object to FormData
 */
export function useFormData<T extends Record<string, any>>({data}:{data: T}): FormData {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
            data[key].forEach((value: any) => {
                formData.append(`${key}[]`, value)
            })
        } else {
            formData.append(key, data[key])
        }
    })
    return formData
}