<script lang="ts">
	import { ValidationBadges } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import { Primitive, type FormSchema } from "$shared/validation/base"
	import type { Snippet } from 'svelte'
	import humanizeString from "humanize-string"
	import { validators as v } from "$shared/validation"

	////
	// PROPS
	////

	interface ChildrenArgs extends Omit<Props, "children" | "ref" > {
		attrs: FormFieldAttributes
		maxlength?: number
		minlength?: number
		maxCount?: number
		minCount?: number
		validatorLength: number
		fieldValidator: Primitive<unknown>
		required: boolean
	}

	interface Props {
		// Props
		field: string
		placeholder?: string
		label?: string

		description?: string

		// Bindables
		form: FormSchema
		ref?: HTMLElement
		type?: string
		disabled?: boolean
		id?: string
		prepared?: ChildrenArgs

		// Events
		oninput?: (e: Event) => Promise<void> | void
		onfocus?: (e: Event) => Promise<void> | void
		onblur?: (e: Event) => Promise<void> | void

		children?: Snippet<[ChildrenArgs]>
	}

	let {
		// Props
		field,
		placeholder = "",
		label,
		description,

		// Bindables
		form = $bindable(),
		ref = $bindable(undefined),
		type = $bindable("text"),
		disabled = $bindable(false),
		id = $bindable(v4()),
		prepared = $bindable(),

		// Events
		oninput,
		onfocus,
		onblur,

		// Snippets
		children
	}: Props = $props()

	prepared = {
			id, 
			field, 
			form, 
			onfocus,
			onblur: async (e: Event) =>  {
				await touch()
				await onblur?.(e)
			},
			oninput: async (e: Event) => {
				await touch()
				await oninput?.(e)
			},
			attrs: {},
			validatorLength: 0,
		} as ChildrenArgs

	let isReady = $state(false)

	////
	// CONSTANTS
	////

	const formCtx = form.getContext()

	////
	// FUNCTIONS
	////

	async function touch() {
		formCtx.touchedFields[field] = true
	}

	////
	// CALCULATED
	////

	/**
	 * Set the attributes for the field.
	 */
	$effect(() => {
		if (placeholder) {
			prepared.attrs.placeholder = placeholder
		} else if (prepared.attrs.placeholder) {
			placeholder = prepared.attrs.placeholder
		}

		if (description) {
			prepared.attrs.description = description
		} else if (form.fieldAttributes) {
			prepared.attrs.description = form.fieldAttributes[field]?.description
		}

		if (label) {
			prepared.attrs.label = label
		} else if (prepared.attrs.label) {
			label = prepared.attrs.label
		} else {
			prepared.attrs.label = humanizeString(field)
		}

		if (type) {
			prepared.attrs.type = type
		} else if (prepared.attrs.type) {
			type = prepared.attrs.type
		}

		if (ref) {
			// Check if the ref has a modifiable "type", i.e. input element vs textarea
			const descriptor = Object.getOwnPropertyDescriptor(ref, 'type');
			if ("type" in ref && descriptor && typeof descriptor.set === 'function') {
				ref.type = prepared.attrs.type;
			}
		}
		prepared.fieldValidator = form.fields[field]
		if (!prepared.fieldValidator) {
			throw new Error(`Field "${field}" not found in form schema`)
		}
		prepared.validatorLength = Object.values(prepared.fieldValidator.validators).filter(
			validator => !validator["isHidden"] && !(validator instanceof Primitive) && !(validator instanceof v.children.Required)
		).length
		prepared.required = prepared.fieldValidator.validators.some(validator => validator.key === "required")
		prepared.maxCount = prepared.fieldValidator.validators.find(validator => validator.key === "maxCount")?.args["maxCount"]
		prepared.minCount = prepared.fieldValidator.validators.find(validator => validator.key === "minCount")?.args["minCount"]
		isReady = true
	})

	$effect.pre(() => {
		prepared.disabled = disabled || formCtx.meta.disabled
	})

	onMount(() => {
		formCtx.data[field] && touch()
	})

</script>

{#if !!prepared && isReady}
	<div class="mb-2 w-100" title={prepared.disabled ? "Disabled" : ""}>
		<div class="flex items-center mb-1">
			<label class="label inline-flex me-2" for={id}>
				<span class="cursor-pointer select-none" class:text-gray-500={disabled}>
					{prepared.attrs.label}
				</span>
			</label>
			{#if !prepared.disabled && prepared.validatorLength}
				<ValidationBadges fieldValidator={prepared.fieldValidator} {form} {field} />
			{/if}
		</div>

		{#if prepared.attrs?.description}
			<p id="{id}-description" class="text-sm text-gray-500 mb-1 w-100">
				{prepared.attrs.description}
			</p>
		{/if}
		
		{@render children?.({...prepared})}
	</div>
{/if}
