/**
 * Interpolates the api route based on the provided path
 */
export default function apiRoute(path: string): string {
    // split the string into an array with "src/routes/" as the first element
    const split = path.split("src/routes/")
    // Get the last element of the array
    return "/" + split[split.length - 1]
}
