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
            icon: "ic:baseline-email"
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

	let compact = $state(true);

	////
	// COMPUTED
	////

	let currentTile = $derived(Object.keys(sidebarOptions).find((key) => $page.url.pathname.includes(`admin/${key}`)) || "")
    
</script>

<div class="flex flex-grow overflow-y-auto">
	<!-- Sidebar -->
	<aside 
        id="admin-sidebar" 
        class="bg-surface-100-800-token md:block transition-all absolute left-0 top-0 bottom-0 opacity-[98%] md:opacity-100 md:relative z-50 md:z-1" 
        aria-label="Sidebar"
        hidden={compact}
        class:compact
    >
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
					<a href="/admin" class="navLink" class:bg-surface-700={$page.url.pathname === "/admin"}>
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
								class:bg-surface-700={currentTile === resource}
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
					<a href="/admin/help" class="navLink" class:bg-surface-700={$page.url.pathname.includes("/admin/help")}>
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
		<button type="button" class="w-full md:hidden btn variant-filled mb-2 rounded-sm" disabled={!compact} onclick={() => {compact = false}}>
            <span class="navIcon">
                <Icon class="h-7 w-7 mr-1" icon="mdi:menu"/>
            </span>
            Show Sidebar
        </button>
		{@render children?.()}
	</main>
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
