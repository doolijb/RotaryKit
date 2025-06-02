<script lang="ts">
   	import { FieldBase, ValidationBadges } from "$client/components"
	import { onMount, type ComponentProps } from "svelte"
	import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"
	import humanizeString from "humanize-string"
	import { ValidStates } from "$shared/constants"

	////
	// PROPS
	////

	interface Props extends Omit<ComponentProps<typeof FieldBase>, "children"> {
		// Props
		type?: "checkbox"
	}

	let {
		// Props
		type = "checkbox",

		// Bindables
		disabled = $bindable(false),
		ref = $bindable(undefined),
		...restProps
	}: Props = $props()

	const formCtx = restProps.form.getContext()
</script>

<FieldBase bind:ref {...restProps, type}>
	{#snippet children({
		id, 
		attrs, 
		field, 
		disabled, 
		maxlength, 
		minlength,
		onfocus,
		oninput,
		onblur,
		validatorLength,
		fieldValidator,
		form,
		required,
	})}
		<div class="flex items-center">
			<input
				{id}
				{disabled}
				{required}
				class="checkbox me-3 mb-2" 
				{type}
				bind:this={ref}
				checked={!!formCtx.data[field]}
				{onfocus}
				{oninput}
				{onblur}
				aria-label={attrs.label}
			/>
		</div>
	{/snippet}
</FieldBase>
