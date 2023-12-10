/**
 * Interpolates the api route based on the provided path
 */
export default function apiRoute(path: string, params?: Record<string, string>): string {
    // split the string into an array with "src/routes/" as the first element
    const split = path.split("src/routes/")
    // Get the last element of the array
    path = split[split.length - 1]

    if (params) {
        // Replace the params in the path
        for (const [key, value] of Object.entries(params)) {
            path = path.replace(key, value)
            path = path.replace(key, value)
        }
    }

    return path
}
