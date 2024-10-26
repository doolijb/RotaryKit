<script lang="ts">
	import { TextInput } from "$client/components"
	import Icon from "@iconify/svelte"
	import { createEventDispatcher, onMount, type Snippet } from "svelte"
	import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"

	const dispatch = createEventDispatcher()

	////
	// PROPS
	////

	interface Props {
		// Props
		field: string;
		form: FormSchema;
		placeholder?: string;
		label?: string;

		// Bindables
		data?: Record<string, any>;
		errors?: Record<string, any>;
		ref?: any;
		disabled?: boolean;
		id?: string;
		isTouched?: boolean;
		showPassword?: boolean;

		// Events
		oninput?: (e: Event) => void;
		onfocus?: (e: Event) => void;
		onblur?: (e: Event) => void;
	}

	let {
		// Props
		field,
		form,
		placeholder,
		label,

		// Bindables
		data = $bindable({}),
		errors = $bindable({}),
		ref = $bindable(undefined),
		disabled = $bindable(false),
		id = $bindable(v4()),
		isTouched = $bindable(false),
		showPassword = $bindable(false),

		// Events
		oninput,
		onfocus,
		onblur
	}: Props = $props();

	////
	// CALCULATED
	////
	
	let type = $derived(showPassword ? "text" : "password")

	////
	// FUNCTIONS
	////

	function togglePasswordVisibility() {
		showPassword = !showPassword
	}


</script>

<TextInput
	{label}
	{placeholder}
	{field}
	{form}
	{errors}
	{data}
	{type}
	bind:id
	bind:disabled
	bind:ref
	bind:isTouched
	{oninput}
	{onfocus}
	{onblur}
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	{#snippet suffixSnippet()}
		<span
			
			onclick={togglePasswordVisibility}
			class="text-surface-500 cursor-pointer"
			title="Show Password"
		>	
			{#if !showPassword}
				<Icon icon="mdi:eye-outline" width="2em" />
			{:else}
				<Icon class="opacity-50 hover:opacity-100" icon="mdi:eye-off-outline" width="2em" />
			{/if}
		</span>
	{/snippet}
</TextInput>
