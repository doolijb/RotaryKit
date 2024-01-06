<script lang="ts">
	import { page } from "$app/stores"
	import Icon from "@iconify/svelte"
	import { AppShell } from "@skeletonlabs/skeleton"
	import { hasAdminPermission } from "$utils"
	import { SiteNavigation } from "$components"
	import type { ComponentEvents } from 'svelte';

	function scrollHandler(event: ComponentEvents<AppShell>['scroll']) {
		console.log(event.currentTarget.scrollTop);
	}

	$: currentTile =
		Object.keys(sidebarOptions).find((key) => $page.url.pathname.includes(`admin/${key}`)) || ""
	$: compact = false

	const sidebarOptions = {
		users: {
			title: "Users",
			icon: "mdi:accounts"
		},
		emails: {
			title: "Emails",
			icon: "entypo:email"
		},
		adminRoles: {
			title: "Admin Roles",
			icon: "mdi:shield-account"
		}
	}

</script>

<AppShell slotSidebarLeft="bg-surface-200" scrollbarGutter="hidden" on:scroll={scrollHandler}>
	<svelte:fragment slot="header">
		<SiteNavigation />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<aside id="admin-sidebar" aria-label="Sidebar" class:compact>
			<div class="h-100 px-3 py-4 overflow-y-auto">
				<ul class="space-y-2 font-medium">
					<li class="pb-3">
						<!-- Compact - expand button -->
						<button
							class="compactBtn"
							on:click={() => (compact = !compact)}
							title={compact ? "Expand" : "Collapse"}
						>
							<span class="navIcon">
								<Icon class="h-7 w-7" icon="mdi:menu" />
							</span>
							<span class="ms-2" class:hidden={compact}>Collapse</span>
						</button>
					</li>
					<li class="pb-3">
						<a href="/" class="navLink">
							<span class="navIcon">
								<Icon class="h-7 w-7" icon="mdi:home" />
							</span>
							<span class="ms-2" class:hidden={compact}>Home</span>
						</a>
					</li>
					<li>
						<a href="/admin" class="navLink" class:active={$page.url.pathname === "/admin"}>
							<span class="navIcon">
								<Icon class="h-7 w-7" icon="clarity:dashboard-solid" />
							</span>
							<span class="ms-2" class:hidden={compact}>Dashboard</span>
						</a>
					</li>
					{#each Object.entries(sidebarOptions) as [resource, option]}
						{#if hasAdminPermission( { adminPermissions: $page.data.adminPermissions, action: "GET", resources: [resource] } )}
							<li>
								<a
									href={`/admin/${resource}`}
									class="navLink"
									class:active={currentTile === resource}
								>
									<span class="navIcon">
										<Icon class="h-7 w-7" icon={option.icon} />
									</span>

									<span class="ms-2" class:hidden={compact}>{option.title}</span>
								</a>
							</li>
						{/if}
					{/each}
					<li class="py-3">
						<a href="/admin/help" class="navLink" class:active={$page.url.pathname.includes("/admin/help")}>
							<span class="navIcon">
								<Icon class="h-7 w-7" icon="mdi:help-circle" />
							</span>
							<span class="ms-2" class:hidden={compact}>Help</span>
						</a>
					</li>
				</ul>
			</div>
		</aside>
	</svelte:fragment>
	<div class="m-5">
		<slot />
	</div>
	<div slot="pageFooter" class="variant-soft-surface p-4 flex justify-center gap-4">
		<p class="text-center opacity-75 inline">
			Application Version: Pre-Alpha
		</p>
		<span class="opacity-75">|</span>
		<a href="/admin/help" class="opacity-75 hover:opacity-100">
			Help
		</a>
	</div>
</AppShell>

<style lang="postcss">
	#admin-sidebar {
		@apply sm:fixed;
		@apply sm:top-0;
		@apply sm:left-0;
		@apply md:relative;
		@apply z-40;
		@apply w-64;
		@apply transition-transform;
		@apply -translate-x-full;
		@apply sm:translate-x-0;
	}

	#admin-sidebar.compact {
		@apply w-auto;
	}

	#admin-sidebar .navLink,
	#admin-sidebar .compactBtn {
		@apply flex;
		@apply items-center;
		@apply p-2;
		@apply text-surface-900;
		@apply rounded-lg;
		@apply dark:text-white;
		@apply hover:bg-surface-50;
		@apply w-full;
	}

	#admin-sidebar .navLink.active {
		@apply bg-surface-50;
		@apply text-surface-800;
	}

	#admin-sidebar .navLink.active .navIcon {
		@apply text-surface-800;
	}

	#admin-sidebar .navIcon {
		@apply text-surface-500;
		@apply transition;
		@apply duration-75;
	}
</style>
