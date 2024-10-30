const fileTypes: FileTypes = {
	image: [
		"jpg",
		"jpeg",
		"png",
		"webp",
		"svg",
		"ico",
		"bmp",
		"gif",
		"tiff",
		"tif",
		"psd",
		"ai",
		"sketch",
		"fig"
	],
	document: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf", "csv"],
	video: ["mp4", "mov", "avi", "wmv", "flv", "mkv"],
	audio: ["mp3", "wav", "flac", "ogg", "wma", "aac", "m4a"],
	archive: ["zip", "rar", "7z", "tar"],
	code: ["json", "xml", "yml", "yaml", "toml", "ini", "cfg", "conf", "md", "markdown", "rst"]
}

export default fileTypes
