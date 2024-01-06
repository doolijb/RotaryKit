<script lang="ts">
	import { BasicTextInput } from "$components"
	import Icon from "@iconify/svelte"

	// Values
	export let label = "Passphrase"
	export let value = ""
	export let placeholder: string | undefined = undefined
	export let disabled = false
	export let type = "password"
	export let id: string | undefined = undefined

	// Events
	export let onInput: (e: Event) => void | undefined = undefined
	export let onBlur: (e: Event) => void | undefined = undefined
	export let onFocus: (e: Event) => void | undefined = undefined

	// Refs
	export let ref: HTMLInputElement | undefined = undefined

	// Validation
	export let fieldValidator: FieldValidator
	export let fieldErrors: FieldErrors = {}

	// Visibility
	let showPassword = true // false

	// Methods
	function togglePasswordVisibility() {
		showPassword = !showPassword
		ref.type = showPassword ? "password" : "text"
	}
</script>

<BasicTextInput
	bind:label
	bind:id
	bind:type
	bind:fieldValidator
	bind:value
	bind:fieldErrors
	bind:disabled
	bind:ref
	bind:placeholder
	bind:onFocus
	bind:onBlur
	bind:onInput
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span
		slot="suffix"
		on:click={togglePasswordVisibility}
		class="text-surface-500 cursor-pointer"
		title="Show Password"
	>	{#if !showPassword}
		<Icon icon="mdi:eye-outline" width="2em" />
		{:else}
		<Icon class="opacity-50 hover:opacity-100" icon="mdi:eye-off-outline" width="2em" />
		{/if}
	</span>
</BasicTextInput>

<style lang="postcss">
</style>
