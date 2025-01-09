export class VideoStatus {
	// static readonly PROCESSING = "processing"
	static readonly UNPUBLISHED = "Unpublished"
	static readonly PUBLISHED = "Published"
	// static readonly ERROR_UPLOADING = "error uploading"
	// static readonly ERROR_PROCESSING = "error processing"

	static Option:
		| typeof VideoStatus.UNPUBLISHED
		// typeof VideoStatus.PROCESSING
		| typeof VideoStatus.PUBLISHED
	// | typeof VideoStatus.ERROR_UPLOADING
	// | typeof VideoStatus.ERROR_PROCESSING

	static options = [
		// VideoStatus.PROCESSING,
		VideoStatus.UNPUBLISHED,
		VideoStatus.PUBLISHED
		// VideoStatus.ERROR_UPLOADING,
		// VideoStatus.ERROR_PROCESSING
	]
}
