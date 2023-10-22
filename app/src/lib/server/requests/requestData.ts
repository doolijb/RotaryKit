import { error } from '@sveltejs/kit'

export async function requestData(request: Request): Promise<{ [key: string]: string }> {
    let data: { [key: string]: string } = {}

    if (request.headers.get('content-type')?.includes('form')) {
        // Form Data
        const formData = await request.formData()
        for (const [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                data[key] = value.trim()
            }
        }
    } else if (request.headers.get('content-type')?.includes('json')) {
        // JSON
        data = await request.json()
    } else {
        // Unhandled Content Type
        throw error(400, 'Invalid content type')
    }

    return data
}