<script lang="ts">
	import { FieldBase, ValidationLegend } from "$client/components"
	import type { FormSchema } from "$shared/validation/base"
	import type { ComponentProps, Snippet } from 'svelte'

	
	////
	// PROPS
	////

	interface Props extends Omit<ComponentProps<typeof FieldBase>, "children"> {
		prefixSnippet?: Snippet<[{
			disabled: boolean,
			attrs: {
				label?: string
				description?: string
			}
			form: FormSchema
			field: string
		}]>
		suffixSnippet?: Snippet<[{
			disabled: boolean,
			attrs: {
				label?: string
				description?: string
			}
			form: FormSchema
			field: string
		}]>
	}

	let {
		ref = $bindable(undefined),
		prefixSnippet,
		suffixSnippet,
		...restProps
	}: Props = $props()
	
	////
	// CONSTANTS
	////

	const formCtx = restProps.form.getContext()

</script>

<FieldBase bind:ref {...restProps}>
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
		{@const showLegend = !disabled && (validatorLength || attrs?.description)}
		<div class="input-group flex px-1 py-0 input items-center bg-surface-200-800">
			{#if prefixSnippet}
				<div class="align-middle m-0 px-0">
					{@render prefixSnippet?.({disabled, attrs, form, field})}
				</div>
			{/if}
			<input
				bind:this={ref}
				{id}
				type={attrs.type}
				class="appearance-none border-0 bg-transparent flex-grow my-1 focus:outline-none focus:ring-0"
				class:me-1={suffixSnippet || showLegend}
				placeholder={attrs.placeholder}
				bind:value={formCtx.data[field]}
				{disabled}
				{required}
				{maxlength}
				{minlength}
				{onfocus}
				{oninput}
				{onblur}
				aria-label={attrs.label}
				aria-describedby={attrs.description ? `${id}-description` : undefined}
			/>
			{#if suffixSnippet}
				<div class="align-middle m-0 px-0 me-2 !border-l-0 h-fit">
					{@render suffixSnippet?.({disabled, attrs, form, field})}
				</div>
			{/if}
			{#if showLegend}
				<div class="legendIcon align-middle px-0 me-2 !border-l-0 ms-1 h-fit">
					<ValidationLegend {fieldValidator} {form} {field} {attrs} />
				</div>
			{/if}
		</div>
	{/snippet}
</FieldBase>

<style lang="postcss">
    .input-group div.px-0 {
        padding-left: 0 !important
        padding-right: 0 !important
    }
</style>
