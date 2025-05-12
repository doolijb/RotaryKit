<script lang="ts">
	import { FieldBase, Input } from "$client/components"
	import * as Icon from "lucide-svelte"
	import type { ComponentProps } from "svelte"

	////
	// PROPS
	////

	interface Props extends Omit<ComponentProps<typeof FieldBase>, "children" | "type"> {
		// Bindables
		showPassword?: boolean;
	}

	let {
		// Bindables
		ref = $bindable(undefined),
		showPassword = $bindable(false),

		...restProps
	}: Props = $props();

	////
	// CALCULATED
	////
	
	let type = $derived(showPassword ? "text" : "password")

</script>


<Input
	{...restProps}
	bind:ref
	{type}
>
	{#snippet suffixSnippet({disabled})}
		{#if !disabled}
			<button
				type="button"
				onclick={(e) => {showPassword = !showPassword}}
				class="cursor-pointer p-0 m-0 h-fit flex items-center"
				title={showPassword ? "Hide passphrase" : "Show passphrase"}
				aria-label={showPassword ? "Hide passphrase" : "Show passphrase"}
				aria-pressed={showPassword}
			>	
				{#if !showPassword}
					<Icon.Eye class="opacity-50 hover:opacity-100" width="2em" />
				{:else}
					<Icon.EyeClosed class="opacity-50 hover:opacity-100" width="2em" />
				{/if}
			</button>
		{/if}
	{/snippet}
</Input>
