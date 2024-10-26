<script>
	import { SiteFooter, SiteNavigation } from "$client/components"
	import { AppShell } from "@skeletonlabs/skeleton"
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<AppShell class="bg-gradient">
	{#snippet header()}
	
			<SiteNavigation />
		
	{/snippet}
	<div class="min-h-screen">
		{@render children?.()}
	</div>
	{#snippet pageFooter()}
		<SiteFooter />
	{/snippet}
</AppShell>
