<script lang="ts">
	import type { FormSchema, Primitive } from "$shared/validation/base"
	import { ValidStates } from "$shared/constants"
	import { Tooltip } from "@skeletonlabs/skeleton-svelte"

	////
	// PROPS
	////

	interface Props {
		form: FormSchema
		fieldValidator: Primitive<unknown>
		field: string
		hideRequired?: boolean,
	}

	let { 
		form,
		fieldValidator, 
		hideRequired = false,
		field,
    	}: Props = $props()

	////
	// CONSTANTS
	////

	const formCtx = form.getContext()
	const validatorKeys = fieldValidator.validators.map((v) => v.key)

	////
	// STATE
	////

	let responseValidators: FieldErrors = $state({})
	let openBadges: Record<string, boolean> = $state({})

	////
	// CALCULATED
	////

	let stickyValidators = $derived(
		Object.values(fieldValidator.validators).filter(
			(validator) =>
				validator.isSticky &&
				!validator.isHidden &&
				validator.popup &&
				((validator.key === "required" && !hideRequired) || validator.key !== "required")
		)
	)
	let dynamicValidators = $derived(
		Object.values(fieldValidator.validators).filter(
			(validator) => !validator.isHidden && !validator.isSticky && !!formCtx.errors[field]?.[validator.key]
		)
	)

	// Filter out validators that are not in the fieldValidator
	$effect(() => {
		const res: FieldErrors = {}
		if (formCtx.validStates[field] === ValidStates.INVALID) {
			if (formCtx.errors[field] !== undefined) {
				Object.keys(formCtx.errors[field]).forEach((key) => {
					if (!validatorKeys.includes(key)) {
						res[key] = formCtx.errors[field][key]
					}})
			}
			responseValidators = res
		}
	})

	let validators = $derived([...stickyValidators, ...dynamicValidators].slice(0, 3))

	$effect(() => {
		console.log("badges touchedFields", formCtx.touchedFields)
	})

</script>
<div class="flex gap-2 items-center">
    {#each Object.values(validators) as validator}
		{@const isError = formCtx.validStates[field] === ValidStates.INVALID ? !!formCtx.errors[field]?.[validator.key] : false}
		<Tooltip
			open={openBadges[validator.key]}
			onOpenChange={(e) => {openBadges[validator.key] = e.open}}
			arrow
			arrowBackground={isError ? "!bg-error-400-600" : "!bg-success-400-600"}
			zIndex="10"
			>
			{#snippet trigger()}
				<span
					class="badge select-none px-1 py-0 text-xs"
					class:preset-tonal-success={!isError}
					class:preset-tonal-error={isError}
					aria-label={`${validator.message}`}
				>
					{validator.badge}
				</span>
			{/snippet}
			{#snippet content()}
				<div
					class="card z-10 block p-4"
					class:preset-filled-success-400-600={!isError}
					class:preset-filled-error-400-600={isError}
					data-popup={validator.popup.target}
				>
					<p>{validator.message}</p>
				</div>
			{/snippet}
		</Tooltip>
	{/each}
</div>

<!-- {#each Object.entries(responseValidators) as [key, message]}
	{@const resPopup = popupSettings()}
	<span
		class="badge mb-2 select-none"
		class:preset-soft-error={true}
		aria-label=message
	>
		{humanizeString(key)}
	</span>
	<div
		class="card z-10 block p-4 hidden"
		class:preset-filled-error={true}
		data-popup={resPopup.target}
	>
		<p>{message}</p>
		<div class="arrow" class:preset-filled-error={true}></div>
	</div>
{/each} -->
