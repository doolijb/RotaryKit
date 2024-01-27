<script lang="ts">
	import { TextInput } from "$components"
	import Icon from "@iconify/svelte"
	import { createEventDispatcher, onMount } from "svelte"
	import { v4 } from "uuid"
	import type { FormSchema } from "$validation/base"

	const dispatch = createEventDispatcher()

	////
	// UPSTREAM EXPORTS
	////

	export let field: string
	export let form: FormSchema
	export let data: typeof form["Data"]
	export let errors: FormErrors
	const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]

	////
	// LOCAL EXPORTS
	////

	export let ref: HTMLInputElement = undefined
	export let placeholder = attrs?.placeholder
	export let label:string = attrs?.label
	export let disabled: boolean = false
	export let id: string = v4()
	export let isTouched = false
	export let showPassword = false

	////
	// CALCULATED
	////

	$: type = showPassword ? "text" : "password"
	$: ref && (ref.type = type)

	////
	// FUNCTIONS
	////

	function togglePasswordVisibility() {
		showPassword = !showPassword
	}

	////
	// EVENTS
	////

	function handleOnBlur(e: Event) {
		dispatch("blur", e)
	}

	function handleOnFocus(e: Event) {
		dispatch("focus", e)
	}

	function handleOnInput(e: Event) {
		dispatch("input", e)
	}

</script>

<TextInput
	bind:label
	bind:id
	bind:disabled
	bind:ref
	bind:placeholder
	bind:isTouched
	bind:type
	{field}
	{form}
	{errors}
	{data}
	on:input={handleOnInput}
	on:focus={handleOnFocus}
	on:blur={handleOnBlur}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span
		slot="suffix"
		on:click={togglePasswordVisibility}
		class="text-surface-500 cursor-pointer"
		title="Show Password"
	>	
		{#if !showPassword}
			<Icon icon="mdi:eye-outline" width="2em" />
		{:else}
			<Icon class="opacity-50 hover:opacity-100" icon="mdi:eye-off-outline" width="2em" />
		{/if}
	</span>
</TextInput>

<style lang="postcss">
</style>
