

export default async function jsonResponse({
    data, 
    status = 200, 
    headers = {},
}:{
    data: {[key: string]: any},
    status?: number,
    headers?: {[key: string]: string},
}) {
    return new Response(
        JSON.stringify(data),
        {
            status,
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
        },
    )
}