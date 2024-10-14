import Component from "."
import type { Meta } from "@storybook/svelte"
import { FormSchema } from "$shared/validation/base"
import { validators as v } from "$shared/validation"
import type { ComponentType } from "svelte"

const meta: Meta<typeof Component> = {
	component: Component as ComponentType,
	tags: ["autodocs"],
	decorators: []
}

export default meta

const file1 = new File([""], "filename.txt", { type: "text/plain" })
Object.defineProperty(file1, 'size', { value: 2 * 1024 * 1024 }); // 2 MB
const file2 = new File([""], "filename2.txt", { type: "text/plain" })
Object.defineProperty(file2, 'size', { value: 4 * 1024 * 1024 }); // 4 MB
const file3 = new File([""], "filename3.jpg", { type: "image/jpeg" })
Object.defineProperty(file3, 'size', { value: 10 * 1024 * 1024 }); // 10 MB

class DefaultForm extends FormSchema {
	fields = {
		fileDropField: v.Files.init()
	}
	optional = { fileDropField: true }
	fieldAttributes = {
		fileDropField: {
			label: "File Drop Field"
		}
	}
}

export const Default = {
	args: {
		field: "fileDropField",
		form: DefaultForm.init(),
		data: { fileDropField: [] },
		errors: {}
	}
}

export const Disabled = {
	args: {
		disabled: true,
		field: "fileDropField",
		form: DefaultForm.init(),
		data: { fileDropField: [] },
		errors: {}
	}
}

export const Filled = {
	args: {
		field: "fileDropField",
		form: DefaultForm.init(),
		data: { fileDropField: [
			file1,
			file2
		] },
		errors: {}
	}
}

class WithValidatorsForm extends FormSchema {
	fields = {
		fileDropField: v.Files.init().fileTypes({ fileTypes: ["document"] }).maxFileCount({ maxCount: 3, typeMaxCount: {"document": 2, "image": 1}}).fileSizes({ maxSize: 15, typeSizes: { document: 10 }})
	}
	optional = {}
	fieldAttributes = {
		fileDropField: {
			label: "File Drop Field",
			description:
				"You use the form validator field description to provide more details here."
		}
	}
}

export const WithValidators = {
	args: {
		field: "fileDropField",
		form: WithValidatorsForm.init(),
		data: { fileDropField: [] },
		errors: {}
	}
}

export const FilledWithValidators = {
	args: {
		field: "fileDropField",
		form: WithValidatorsForm.init(),
		data: { fileDropField: [
			file1,
			file2,
			file3
		] },
		errors: {}
	}
}

class WithPlaceholderForm extends FormSchema {
	fields = {
		fileDropField: v.Files.init()
	}
	optional = {}
	fieldAttributes = {
		fileDropField: {
			label: "File Drop Field",
			placeholder: "Enter your name"
		}
	}
}

export const WithPlaceholder = {
	args: {
		field: "fileDropField",
		form: WithPlaceholderForm.init(),
		data: { fileDropField: "" },
		errors: {}
	}
}
