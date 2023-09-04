<script lang="ts">
	import type { Primitive } from "$shared/validation/base"
	import { popup } from "@skeletonlabs/skeleton"

	////
	// PROPS
	////

	interface Props {
		fieldErrors: FieldErrors
		fieldValidator: Primitive<unknown>
		hideRequired?: boolean
	}

	let { 
        fieldErrors, 
        fieldValidator, 
        hideRequired = false 
    }: Props = $props()

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
			(validator) => !validator.isHidden && !validator.isSticky && !!fieldErrors[validator.key]
		)
	)
	let validators = $derived([...stickyValidators, ...dynamicValidators].slice(0, 3))

</script>

{#each Object.values(validators) as validator}
	<span
		class="badge ms-1 mb-2 select-none"
		class:variant-soft-primary={!fieldErrors[validator.key]}
		class:variant-soft-error={!!fieldErrors[validator.key]}
		use:popup={validator.popup}
		aria-label={`${validator.message}`}
	>
		{validator.badge}
	</span>
	<div
		class="card z-10 block p-4 hidden"
		class:variant-filled-primary={!fieldErrors[validator.key]}
		class:variant-filled-error={!!fieldErrors[validator.key]}
		data-popup={validator.popup.target}
	>
		<p>{validator.message}</p>
		<div
			class="arrow"
			class:variant-filled-primary={!fieldErrors[validator.key]}
			class:variant-filled-error={!!fieldErrors[validator.key]}
		></div>
	</div>
{/each}
