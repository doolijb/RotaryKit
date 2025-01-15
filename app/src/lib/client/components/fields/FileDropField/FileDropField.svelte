<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import { FileUpload, type PopupSettings } from "@skeletonlabs/skeleton-svelte"
	import type { FormSchema } from "$shared/validation/base"
	import { fileTypes } from "$shared/data"
	import Icon from "@iconify/svelte"
	import humanizeString from "humanize-string"

	////
	// LOCAL EXPORTS
	////

	interface Props {
		// Props
		field: string
		form: FormSchema
		label?: string
		disabled?: boolean
		showFiles?: boolean

		// Bindables
		data?: Record<string, any>
		errors?: Record<string, any>
		ref?: HTMLInputElement
		id?: string
		isTouched?: boolean

		// Events
		onfocus?: (e: Event) => void
		onblur?: (e: Event) => void
		oninput?: (e: Event) => void
	}

	let {
		// Props
		field,
		form,
		label,
		disabled = $bindable(false),		showFiles = true,

		// Bindables
		data = $bindable({} as FormDataOf<any>),
		errors = $bindable({}),
		ref = $bindable(undefined),
		id = $bindable(v4()),
		isTouched = $bindable(false),

		// Events
		onfocus,
		onblur,
		oninput,

	}: Props = $props()

	////
	// STATE
	////

	let fieldErrors: FieldErrors = $state({})
	let addedFiles: FileList = $state()
	let listedAvailableExtensions: string = $state()
	let listedFileSizes: string = $state()
	let listedMaxFileCounts: string = $state()

	////
	// FUNCTIONS
	////

	async function addFilesToForm() {
		const initialDisabled = disabled
		disabled = true
		// Remove any files already in the data
		const newFiles = Array.from(addedFiles).filter((file) => !data[field].find((f: File) => f.name === file.name))
		const updatedFiles = data[field] || []
		newFiles.forEach((file) => {
			if (!updatedFiles.find((f) => f.name === file.name)) {
				updatedFiles.push(file)
			}
		})
		data[field] = updatedFiles
		// Clear the added files
		addedFiles = null
		disabled = initialDisabled
		await touch()
	}


	async function validate() {
		let fieldErrors = await form.fields[field].validate({key:field, data})
		if (Object.keys(fieldErrors).length) {
			errors[field] = fieldErrors
		} else {
			delete errors[field]
		}
	}

	async function touch() {
		isTouched = true
		validate()
	}

	function getFileAcceptsAttr() {
		if (!fileTypesValidator) return

		let extensions = []
		// if ("fileTypes" in fileTypesValidator.args) {
		// 	;(fileTypesValidator.args.fileTypes as FileType[]).forEach((fileType) => {
		// 		extensions.push(...fileTypes[fileType])
		// 	})
		// }
		if ("extensions" in fileTypesValidator.args) {
			extensions.push(...(fileTypesValidator.args.extensions as FileExtension[]).map((ext) => `.${ext}`))
		}

		return extensions.join(",")
	}

	function listAvailableExtensions(): string {
		if (!fileTypesValidator) return

		let extensions = []
		if ("fileTypes" in fileTypesValidator.args) {
			;(fileTypesValidator.args.fileTypes as FileType[]).forEach((fileType) => {
				extensions.push(...fileTypes[fileType])
			})
		}
		if ("extensions" in fileTypesValidator.args) {
			extensions.push(...(fileTypesValidator.args.extensions as FileExtension[]))
		}

		// Remove duplicates and sort alphabetically
		extensions = extensions
			.filter((extension, index, self) => self.indexOf(extension) === index)
			.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))

		// Transform to uppercase and join with a comma and a space
		return extensions
			.map((extension) => extension.toUpperCase())
			.join(", ")
			.replace(/,([^,]*)$/, ", or$1")
	}

	function listFileSizes(): string {
		if (!fileSizesValidator) return

		let typeSizes: Record<string, number> = {}
		let maxSize = undefined

		if ("maxSize" in fileSizesValidator.args) {
			maxSize = fileSizesValidator.args.maxSize as number
		}

		if ("typeSizes" in fileSizesValidator.args) {
			typeSizes = fileSizesValidator.args.typeSizes as Record<string, number>
		}

		Object.keys(typeSizes).forEach((type) => {
			if (maxSize && typeSizes[type] >= maxSize) {
				delete typeSizes[type]
			}
		})

		let maxResult = ""
		let typesResult = ""
		let finalResult = ""

		if (maxSize) {
			maxResult = `Maximum ${maxSize} MB`
		}

		if (Object.keys(typeSizes).length > 0) {
			typesResult = `up to ${Object.keys(typeSizes)
				.map((type) => `${typeSizes[type]} MB for ${type}`)
				.join(", ")} files`
		}

		if (maxResult && typesResult) {
			finalResult = `${maxResult} and ${typesResult}`
		} else {
			finalResult = maxResult || typesResult
		}
		return finalResult
	}

	function listMaxFileCounts(): string {
		if (!maxFileCountValidator) return

		const typeMaxCount: Record<FileType, number> = {} as Record<FileType, number>

		if ("typeMaxCount" in maxFileCountValidator.args) {
			Object.keys(maxFileCountValidator.args["typeMaxCount"]).forEach((type) => {
				typeMaxCount[type as FileType] = maxFileCountValidator.args["typeMaxCount"][type]
			})
		}

		if (maxFileCount && Object.keys(typeMaxCount).length > 0) {
			return `Maximum ${maxFileCount} files, with  up to ${Object.keys(typeMaxCount)
				.map((type) => `${typeMaxCount[type]} ${type}`)
				.join(", ")}`
		} else if (maxFileCount) {
			return maxFileCount > 1 ? `Maximum ${maxFileCount} files` : null
		} else if (Object.keys(typeMaxCount).length > 0) {
			return `up to ${Object.keys(typeMaxCount)
				.map((type) => `${typeMaxCount[type]} ${type}`)
				.join(", ")} files`
		}
	}

	function getFileTypeIcon(filename: string) {
		const extension: FileExtension = filename.split(".").pop().toLowerCase() as FileExtension
		const FileTypeIcons: Record<FileType, string> = {
			document: "line-md:file-document",
			image: "line-md:image",
			video: "line-md:file-video",
			audio: "line-md:file-audio",
			archive: "line-md:file-archive",
			code: "line-md:file-code"
		}

		// Get file type from extension
		const fileType = Object.keys(fileTypes).find((fileType) =>
			fileTypes[fileType].includes(extension)
		)

		return fileType ? FileTypeIcons[fileType] : "line-md:file"
	}

	function removeFile(file: File) {
		data[field] = data[field].filter((f) => f !== file)
		touch()
	}

	////
	// EVENTS
	////

	function handleOnBlur(e: Event) {
		touch()
		onblur?.(e)
	}

	function handleOnInput(e: Event) {
		touch()
		oninput?.(e)
	}

	////
	// CALCULATED
	////

	let attrs = $derived(form.fieldAttributes[field])
	let fieldValidator = $derived(form.fields[field])
	let validatorLength = $state(0);
	
	let fileTypesValidator = $derived(fieldValidator
		? fieldValidator.validators.find((validator) => validator.key === "fileTypes")
		: undefined)
	let fileSizesValidator = $derived(fieldValidator
		? fieldValidator.validators.find((validator) => validator.key === "fileSizes")
		: undefined)
	let maxFileCountValidator = $derived(fieldValidator
		? fieldValidator.validators.find((validator) => validator.key === "maxFileCount")
		: undefined)
	let allowMultiSelect = $derived(maxFileCountValidator
		? (maxFileCountValidator.args["maxCount"] || 1) > 1
		: true)
	let hasFileRelatedErrors = $derived(!!Object.keys(fieldErrors).find((key) => key !== "required") || false)
	let maxFileCount = $derived(maxFileCountValidator.args["maxCount"] || undefined)

	$effect.pre(() => {
		if (!label) {
			if (attrs && attrs.label) {
				label = attrs.label
			} else {
				label = humanizeString(field)
			}
		}
	})

	$effect.pre(() => {
		validatorLength = Object.values(fieldValidator.validators).filter(
			(validator) => !validator.isHidden
		).length
	});

	$effect.pre(() => {
		if (addedFiles && addedFiles.length) { 
			addFilesToForm()
		}
	})

	$effect.pre(() => {
		if (!Array.isArray(data[field])) {
			data[field] = []
		}
	})

	$effect(() => {
		fieldErrors = errors[field] || {}
	})

	////
	// LIFECYCLE
	////

	onMount(async () => {
		if (data[field]) {
			await touch()
		}
		listedAvailableExtensions = listAvailableExtensions()
		listedFileSizes = listFileSizes()
		listedMaxFileCounts = listMaxFileCounts()
	})
</script>

<div class="mb-2">
	<div class="flex items-center">
		<label class="label inline-flex pb-2" for={id}>
			<span class="cursor-pointer select-none" class:text-gray-500={disabled}>
				{label}
			</span>
		</label>
		{#if !disabled}
			<ValidationBadges {fieldValidator} bind:fieldErrors />
		{/if}
	</div>

	<!-- Show the drop zone if we can accept multiple files, or if 1 file max and no file selected -->
	 <div class:hidden={!(allowMultiSelect || (!allowMultiSelect && !data[field]?.length))}>
		<FileUpload 
			name={field} 
			{id}
			{disabled}
			bind:files={addedFiles} 
			bind:ref
			{onfocus} 
			multiple={allowMultiSelect} 
			oninput={handleOnInput} 
			onblur={handleOnBlur}
			accept={getFileAcceptsAttr()}
			{...attrs}
		>

			{#snippet message()}
					
				<p class="text-sm">
					{#if allowMultiSelect}
						<b>Upload files</b> or drag and drop multiple
					{:else}
						<b>Upload a file</b> or drag and drop
					{/if}
				</p>
			
			{/snippet}

			{#snippet meta()}
				{#if fileTypesValidator && listedAvailableExtensions}
					<p class="text-sm text-gray-500">{listedAvailableExtensions}</p>
				{/if}
				{#if fileSizesValidator && listedFileSizes}
					<p class="text-sm text-gray-500">{listedFileSizes}</p>
				{/if}
				{#if maxFileCountValidator && listedMaxFileCounts}
					<p class="text-sm text-gray-500">{listedMaxFileCounts}</p>
				{/if}
			{/snippet}

		</FileUpload>
	</div>

	{#if showFiles && data[field]}
		<div
			class="mt-2"
			class:preset-ringed-error={hasFileRelatedErrors}
			class:p-2={hasFileRelatedErrors}
		>
			{#if hasFileRelatedErrors}
				<p class="text-sm text-red-500 mb-1">
					<Icon icon="bi:exclamation-triangle" class="w-4 h-4 me-1 inline" />
					Please correct your selection before continuing
				</p>
			{/if}
			<div class="grid grid-cols-1 gap-2">
				{#each data[field] as file}
					<div class="card p-4 preset-filled-surface">
						<div class="card-body">
							<div class="flex items-center gap-2">
								<Icon icon={getFileTypeIcon(file.name)} class="w-12 h-12" />
								<p class="text-sm">
									{file.name}
									<br />
									{(file.size / 1000000).toPrecision(2)} MB
								</p>
								<button
									class="btn preset-filled-error mt-2 ml-auto mt-0"
									onclick={() => removeFile(file)}
								>
									<Icon icon="bi:trash" class="w-4 h-4 me-1" />
									Remove
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
