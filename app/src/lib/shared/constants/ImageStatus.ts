export class ImageStatus {
    // static readonly PROCESSING = "processing"
    static readonly UNPUBLISHED = "unpublished"
    static readonly PUBLISHED = "published"
    // static readonly ERROR_UPLOADING = "error uploading"
    // static readonly ERROR_PROCESSING = "error processing"

    static Option: 
        typeof ImageStatus.UNPUBLISHED
        // typeof ImageStatus.PROCESSING 
        | typeof ImageStatus.PUBLISHED 
        // | typeof ImageStatus.ERROR_UPLOADING 
        // | typeof ImageStatus.ERROR_PROCESSING

    static options = [
        // ImageStatus.PROCESSING,
        ImageStatus.UNPUBLISHED,
        ImageStatus.PUBLISHED,
        // ImageStatus.ERROR_UPLOADING,
        // ImageStatus.ERROR_PROCESSING
    ]
}