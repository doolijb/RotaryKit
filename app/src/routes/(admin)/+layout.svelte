<script lang="ts">
    import { page } from "$app/stores";
    import Icon from "@iconify/svelte";
    import { hasAdminPermission } from "$client/utils";
    import { SiteNavigation } from "$client/components";

	////
	// PROPS
	////

    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

	////
	// CONSTANTS
	////

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
        },
        images: {
            title: "Images",
            icon: "mdi:image"
        }
    };

	////
	// STATE
	////

	let compact = $state(false);

	////
	// COMPUTED
	////

	let currentTile = $derived(Object.keys(sidebarOptions).find((key) => $page.url.pathname.includes(`admin/${key}`)) || "")
    
</script>

<div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header>
        <SiteNavigation />
    </header>

    <div class="flex flex-grow">
        <!-- Sidebar -->
        <aside id="admin-sidebar" class="variant-soft-surface" aria-label="Sidebar" class:compact>
			<div class="h-100 px-3 py-4 overflow-y-auto">
				<ul class="space-y-2 font-medium">
					<li class="pb-4">
						<!-- Compact - expand button -->
						<button
							class="navLink compactBtn"
							onclick={() => (compact = !compact)}
							title={compact ? "Expand" : "Collapse"}
						>
							<span class="navIcon">
								<Icon class="h-7 w-7" icon="mdi:menu" />
							</span>
							<span class="ms-2" class:hidden={compact}>Collapse</span>
						</button>
					</li>
					<li class="pb-4">
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
						{#if hasAdminPermission( { user: $page.data.user, adminPermissions: $page.data.adminPermissions, action: "GET", resources: [resource] } )}
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
					<li class="py-4">
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

        <!-- Main Content -->
        <main class="flex flex-col flex-grow p-5 overflow-auto">
            {@render children?.()}
        </main>
    </div>

    <!-- Footer -->
    <footer>
        <div  class="variant-soft-surface p-4 flex justify-center gap-4">
			<p class="text-center opacity-75 inline">
				Version {$page.data.APP_VERSION}
			</p>
			<span class="opacity-75">|</span>
			<a href="/admin/help" class="opacity-75 hover:opacity-100">
				Help
			</a>
		</div>
    </footer>
</div>

<style>
    /* Add any additional styles here */
    .compactBtn {
        display: flex;
        align-items: center;
    }

    .navLink {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        transition: background-color 0.2s;
		width: 100%;
    }

    .navLink:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .navIcon {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .compact .navLink .ms-2 {
        display: none;
    }

	#admin-sidebar:not(.compact) {
		min-width: 15rem;
		max-width: 15rem;
	}
</style>