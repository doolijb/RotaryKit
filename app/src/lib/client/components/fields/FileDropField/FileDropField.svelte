<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { createEventDispatcher, onMount } from "svelte"
	import { v4 } from "uuid"
	import { FileDropzone, type PopupSettings } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$shared/validation/base"
	import { validators } from "$shared/validation"
	import { fileTypes } from "$shared/data"
	import { list } from "postcss"
	import Icon from "@iconify/svelte"

	const dispatch = createEventDispatcher()

	////
	// PARENT EXPORTS
	////

	export let field: string
	export let form: FormSchema
	export let data: typeof form["Data"] & Record<string, File[]>
	export let errors: FormErrors
	const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]

	////
	// LOCAL EXPORTS
	////

	export let ref: HTMLInputElement = undefined
	export let placeholder = attrs?.placeholder
	export let label:string = attrs?.label
	export let disabled: boolean = false
	export let type: string = "text"
	export let id: string = v4()
	export let isTouched = false
	export let autocomplete: string = undefined
	export let showFiles: boolean = true

	let addedFiles: FileList = [] as unknown as FileList

	////
	// CALCULATED
	////

	$: fieldValidator = form.fields[field]
	$: fieldErrors = errors[field] || {}
	$: validatorLength = 0
	$: {
		validatorLength = Object.values(fieldValidator.validators).filter(
			validator => !validator.isHidden
		).length
	}
	$: required = fieldValidator.isRequired
	$: validState = isTouched
		? fieldErrors && Object.keys(fieldErrors).length
			? ValidStates.INVALID
			: data[field]
			  ? ValidStates.VALID
			  : ValidStates.NONE
		: ValidStates.NONE
	$: addedFiles.length && addFilesToForm()
	$: fileTypesValidator = !!fieldValidator ? fieldValidator.validators.find(validator => validator.key === "fileTypes") : undefined
	$: fileSizesValidator = !!fieldValidator ? fieldValidator.validators.find(validator => validator.key === "fileSizes") : undefined
	$: maxFileCountValidator = !!fieldValidator ? fieldValidator.validators.find(validator => validator.key === "maxFileCount") : undefined
	$: allowMultiSelect = !!maxFileCountValidator ? (maxFileCountValidator.args["maxCount"] || 1) > 1 : true
	$: hasFileRelatedErrors = !!Object.keys(fieldErrors).find(key => key !== "required") || false

	////
	// CONSTANTS
	////

	const legendPopup: PopupSettings = ValidationLegend.popupSettings()

	////
	// FUNCTIONS
	////

	function addFilesToForm() {
		data[field] = Array.from(data[field] || []).concat(Array.from(addedFiles))
	}

	function setType(node: HTMLInputElement) {
		// Can not set dynamic type directly in the input element
		node.type = type
	}

	async function validate() {
		errors[field] = await form.fields[field].validate({key:field, data})
	}

	async function touch() {
		isTouched = true
		validate()
	}

	function listAvailableExtensions(): string {
		if (!fileTypesValidator) return;

		let extensions = [];
		if ("fileTypes" in fileTypesValidator.args) {
			(fileTypesValidator.args.fileTypes as FileType[]).forEach(fileType => {
				extensions.push(...fileTypes[fileType]);
			});
		}
		if ("extensions" in fileTypesValidator.args) {
			extensions.push(...(fileTypesValidator.args.extensions as FileExtension[]));
		}

		// Remove duplicates and sort alphabetically
		extensions = extensions
			.filter((extension, index, self) => self.indexOf(extension) === index)
			.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

		// Transform to uppercase and join with a comma and a space
		return extensions.map(extension => extension.toUpperCase()).join(", ").replace(/,([^,]*)$/, ", or$1");;
	}

	function listFileSizes(): string {
		console.log(!!fileSizesValidator)
		if (!fileSizesValidator) return;

		let typeSizes: Record<string, number> = {}
		let maxSize = undefined

		if ("maxSize" in fileSizesValidator.args) {
			maxSize = fileSizesValidator.args.maxSize as number;
		}

		if ("typeSizes" in fileSizesValidator.args) {
			typeSizes = fileSizesValidator.args.typeSizes as Record<string, number>;
		}

		Object.keys(typeSizes).forEach(type => {
			if (maxSize && typeSizes[type] >= maxSize) {
				delete typeSizes[type];
			}
		});

		let maxResult = ""
		let typesResult = ""
		let finalResult = ""

		if (maxSize) {
			maxResult = `Maximum ${maxSize} MB`
		}

		if (Object.keys(typeSizes).length > 0) {
			typesResult = `up to ${Object.keys(typeSizes).map(type => `${typeSizes[type]} MB for ${type}`).join(", ")} files`
		}

		if (maxResult && typesResult) {
			finalResult = `${maxResult} and ${typesResult}`
		} else {
			finalResult = maxResult || typesResult
		}
		return finalResult
	}

	function listMaxFileCounts(): string {
		if (!maxFileCountValidator) return;

		const maxCount = maxFileCountValidator.args["maxCount"] || undefined;
		const typeMaxCount: Record<FileType, number> = {} as Record<FileType, number>;

		if ("typeMaxCount" in maxFileCountValidator.args) {
			Object.keys(maxFileCountValidator.args["typeMaxCount"]).forEach(type => {
				typeMaxCount[type as FileType] = maxFileCountValidator.args["typeMaxCount"][type];
			});
		}

		if (maxCount && Object.keys(typeMaxCount).length > 0) {
			return `Maximum ${maxCount} files, with  up to ${Object.keys(typeMaxCount).map(type => `${typeMaxCount[type]} ${type}`).join(", ")}`
		} else if (maxCount) {
			return `Maximum ${maxCount} files`
		} else if (Object.keys(typeMaxCount).length > 0) {
			return `up to ${Object.keys(typeMaxCount).map(type => `${typeMaxCount[type]} ${type}`).join(", ")} files`
		}
	}

	function getFileTypeIcon(filename: string) {
		const extension: FileExtension = filename.split('.').pop().toLowerCase() as FileExtension;
		const FileTypeIcons: Record<FileType, string> = {
			"document": "line-md:file-document",
			"image": "line-md:image",
			"video": "line-md:file-video",
			"audio": "line-md:file-audio",
			"archive": "line-md:file-archive",
			"code": "line-md:file-code",
		}

		// Get file type from extension
		const fileType = Object.keys(fileTypes).find(fileType => fileTypes[fileType].includes(extension));

		return fileType ? FileTypeIcons[fileType] : "line-md:file";
	}

	function removeFile(file: File) {
		data[field] = data[field].filter(f => f !== file)
		touch()
	}

	////
	// EVENTS
	////

	function handleOnBlur(e: Event) {
		touch()
		dispatch("blur", e)
	}

	function handleOnFocus(e: Event) {
		dispatch("focus", e)
	}

	function handleOnInput(e: Event) {
		touch()
		dispatch("input", e)
	}

	////
	// LIFECYCLE
	////

	onMount(() => {
		data[field] && touch()
	})

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="mb-2">
	<div class="flex items-center">
		<label class="label inline-flex pb-2" for={id}>
			<span class="cursor-pointer select-none" class:text-gray-500={disabled}>
				{label}
			</span>
		</label>
		{#if !disabled}
			<ValidationBadges {fieldValidator} {fieldErrors} />
		{/if}
	</div>

	<!-- <div class="input-group flex">
		{#if $$slots.prefix}
			<div class="align-middle m-0 px-0">
				<slot name="prefix" />
			</div>
		{/if}
		<input
			{id}
			class="input border-0 disabled:cursor-not-allowed"
			use:setType
			bind:this={ref}
			{placeholder}
			bind:value={data[field]}
			{disabled}
			{required}
			on:input={handleOnInput}
			on:focus={handleOnFocus}
			on:blur={handleOnBlur}
			aria-label={label}
			{autocomplete}
		/>
		{#if $$slots.suffix}
			<div class="align-middle m-0 px-0 me-2">
				<slot name="suffix" />
			</div>
		{/if}
		{#if !disabled && validatorLength}
			<div class="legendIcon align-middle px-0 me-3">
				<ValidationLegend.Icon {fieldValidator} {fieldErrors} {validState} {legendPopup} />
			</div>
		{/if}
	</div> -->
	<!-- {#if !disabled && (validatorLength || attrs?.description)}
		<ValidationLegend.Popup {fieldValidator} {fieldErrors} {legendPopup} {attrs} />
	{/if} -->

	<FileDropzone name={field} {id} bind:files={addedFiles} {disabled} multiple={allowMultiSelect}>
		<!-- <svelte:fragment slot="lead">
			(icon)
		</svelte:fragment> -->
		<svelte:fragment slot="message">
			<p class="text-sm">
				{#if allowMultiSelect}
					<b>Upload files</b> or drag and drop multiple
				{:else}
					<b>Upload a file</b> or drag and drop
				{/if}
			</p>
		</svelte:fragment>
		<svelte:fragment slot="meta">
			{#if attrs?.description}
				<p class="text-sm text-gray-500 my-2">{attrs.description}</p>
			{/if}
			{#if fileTypesValidator}
				<p class="text-sm text-gray-500">{listAvailableExtensions()}</p>
			{/if}
			{#if fileSizesValidator}
				<p class="text-sm text-gray-500">{listFileSizes()}</p>
			{/if}
			{#if maxFileCountValidator}
				<p class="text-sm text-gray-500">{listMaxFileCounts()}</p>
			{/if}
		</svelte:fragment>
	</FileDropzone>

	{#if showFiles}
		{#if data[field]}
			<div
				class="mt-2"
				class:variant-ringed-error={hasFileRelatedErrors}
				class:p-2={hasFileRelatedErrors}
			>
				{#if hasFileRelatedErrors}
					<p class="text-sm text-red-500 mb-1">
						<Icon icon="bi:exclamation-triangle" class="w-4 h-4 me-1 inline" />
						Please correct your selection before continuing
					</p>
				{/if}
				<div
					class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2" 
				>
					{#each data[field] as file}
						<div class="card p-4">
							<div class="card-body">
								<div class="flex items">
									<div class="flex items-center">
										<Icon icon={getFileTypeIcon(file.name)} class="w-10 h-10 text-gray-500" />
									</div>
									<div class="flex flex-col ms-2">
										<p class="text-sm text-gray-500">{file.name}</p>
										<p class="text-sm text-gray-500">{(file.size / 1000000).toPrecision(2) } MB</p>
										<button class="btn btn-sm variant-filled-error mt-2" on:click={() => removeFile(file)}>
											<Icon icon="bi:trash" class="w-4 h-4 me-1" />
											Remove
										</button>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>