<script lang="ts">
	import type { Primitive } from "$shared/validation/base"
	import { popup } from "@skeletonlabs/skeleton"
	import { popupSettings } from "$shared/validation/utils"
	import humanizeString from "humanize-string"
	import { ValidStates } from "$shared/constants"

	////
	// PROPS
	////

	interface Props {
		fieldErrors: FieldErrors
		fieldValidator: Primitive<unknown>
		hideRequired?: boolean,
		validState: ValidStates
	}

	let { 
		fieldErrors = $bindable({}), 
		fieldValidator, 
		hideRequired = false,
		validState = $bindable(ValidStates.NONE),
    	}: Props = $props()

	////
	// CONSTANTS
	////

	const validatorKeys = fieldValidator.validators.map((v) => v.key)

	////
	// STATE
	////

	let responseValidators: FieldErrors = $state({})

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

	// Filter out validators that are not in the fieldValidator
	$effect(() => {
		if (validState === ValidStates.INVALID) {
			const res: FieldErrors = {}
			Object.keys(fieldErrors).forEach((key) => {
				if (!validatorKeys.includes(key)) {
					res[key] = fieldErrors[key]
				}})
			responseValidators = res
		}
	})

	let validators = $derived([...stickyValidators, ...dynamicValidators].slice(0, 3))

</script>

{#each Object.values(validators) as validator}
	<span
		class="badge ms-1 mb-2 select-none"
		class:preset-tonal-success={validState !== ValidStates.INVALID ? true : !fieldErrors[validator.key]}
		class:preset-tonal-error={validState === ValidStates.INVALID ? !!fieldErrors[validator.key] : false}
		aria-label={`${validator.message}`}
	>
		{validator.badge}
	</span>
	<div
		class="card z-10 block p-4 hidden"
		class:preset-tonal-primary={validState !== ValidStates.INVALID ? true : !fieldErrors[validator.key]}
		class:preset-tonal-error={validState === ValidStates.INVALID ? !!fieldErrors[validator.key] : false}
		data-popup={validator.popup.target}
	>
		<p>{validator.message}</p>
		<div
			class="arrow"
			class:preset-tonal-primary={validState !== ValidStates.INVALID ? true : !fieldErrors[validator.key}
			class:preset-tonal-error={validState === ValidStates.INVALID ? !!fieldErrors[validator.key] : false}
		></div>
	</div>
{/each}

{#each Object.entries(responseValidators) as [key, message]}
	{@const resPopup = popupSettings()}
	<span
		class="badge ms-1 mb-2 select-none"
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
{/each}
