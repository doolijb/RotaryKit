import { Validator } from "$shared/validation/base"
import { fileTypes } from "$shared/data"

type FileTypeArgs = { fileTypes: FileType[], extensions: FileExtension[] } | { fileTypes: FileType[] } | { extensions: FileExtension[] }

/**
 * Validates that a file is of an allowed extension and/or has an allowed extension.
 * At least one option must be provided and the file extension must match all provided options.
 * I.E. pdf is a type of document, but not all documents are pdfs.
 * 
 * @param args: {fileTypes = FileType[]} args.fileTypes - array of allowed file types
 * @param args: {extensions = AllowedExtensions[]} args.extensions - array of allowed file extensions
 */
export class FileTypes extends Validator { 
    args: FileTypeArgs
    badge = "File types"
    key = "fileTypes"
    message = () => `File must be one of the following types: ${this.listExtensions()}`

    static init(args: FileTypeArgs) {
        if (!args["fileTypes"] && !args["extensions"]) {
            throw new Error("You must provide at least one of fileTypes or extensions.")
        }
        return super.init(args)
    }

    test = async ({key, data}) => {
        const files: File[] = data[key]

        if (!Array.isArray(files)) return false
        const res = files.every(file => {

            const extension = file.name.split('.').pop()?.toLowerCase()

            if ('extensions' in this.args && !this.args.extensions.includes(extension as FileExtension)) {
                return false
            }

            if ('fileTypes' in this.args && !this.args.fileTypes.some((fileType: FileType) => (fileTypes[fileType] as string[])?.includes(extension))) {
                return false
            }

            return true
        })

        return res
    }

    listExtensions: () => string = () => {
        let extensions: string[] = []
        if ('extensions' in this.args) {
            extensions = this.args.extensions
        }
        if ('fileTypes' in this.args) {
            extensions = extensions.concat(...this.args.fileTypes.map(fileType => fileTypes[fileType] ?? []))
        }
        // make sure all are unique and sort alphabetically
        return [...new Set(extensions)].sort().join(", ")
    }
}