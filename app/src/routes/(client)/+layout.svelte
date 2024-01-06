<script>
	import { SiteFooter, SiteNavigation } from "$components"
	import { AppShell } from "@skeletonlabs/skeleton"
</script>

<AppShell class="bg-gradient">
	<svelte:fragment slot="header">
		<SiteNavigation />
	</svelte:fragment>
	<div class="min-h-screen">
		<slot />
	</div>
	<svelte:fragment slot="pageFooter"><SiteFooter /></svelte:fragment>
</AppShell>
