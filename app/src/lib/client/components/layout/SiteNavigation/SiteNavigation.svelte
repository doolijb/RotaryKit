<script lang="ts">
	import { page } from "$app/state"
	import Icon from "@iconify/svelte"
	import { Popover } from "@skeletonlabs/skeleton-svelte"

	let isAccountMenuOpen = $state(false)
</script>

<!-- <div
	data-popup="navUserPopup"
	class="card preset-soft bg-surface-500/95 shadow-xl z-50 p-4 select-none"
>
	<div class="flex flex-col">
		<a
			href="/profile"
			class="text-surface-50 hover:text-surface-900 py-2 px-4 block whitespace-no-wrap"
		>
			<Icon icon="mdi:user" class="mr-2 inline-block" />
			Profile
		</a>
		{#if $page.data.user && ($page.data.user.isAdmin || $page.data.user.isSuperUser)}
			<a
				href="/admin"
				class="text-surface-50 hover:text-surface-900 py-2 px-4 block whitespace-no-wrap"
			>
				<Icon icon="mdi:shield" class="mr-2 inline-block" />
				Admin
			</a>
		{/if}
		<a
			href="/logout"
			class="text-surface-50 hover:text-surface-900 py-2 px-4 block whitespace-no-wrap"
		>
			<Icon icon="mdi:logout" class="mr-2 inline-block" />
			Logout
		</a>
	</div>
</div> -->

{#snippet accountMenu()}
	<Popover
	bind:open={isAccountMenuOpen}
	positioning={{ placement: 'bottom' }}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
	arrow
	arrowBackground="!bg-surface-200 dark:!bg-surface-800"
	>
	{#snippet trigger()}{page.data.user.username}{/snippet}
	{#snippet content()}
		<div class="flex flex-col">
			<a
				href="/profile"
				class="text-surface-50 hover:text-surface-900 py-2 px-4 block whitespace-no-wrap"
			>
				<Icon icon="mdi:user" class="mr-2 inline-block" />
				Profile
			</a>
			{#if page.data.user && (page.data.user.isAdmin || page.data.user.isSuperUser)}
				<a
					href="/admin"
					class="text-surface-50 hover:text-surface-900 py-2 px-4 block whitespace-no-wrap"
				>
					<Icon icon="mdi:shield" class="mr-2 inline-block" />
					Admin
				</a>
			{/if}
			<a
				href="/logout"
				class="text-surface-50 hover:text-surface-900 py-2 px-4 block whitespace-no-wrap"
			>
				<Icon icon="mdi:logout" class="mr-2 inline-block" />
				Logout
			</a>
		</div>
	{/snippet}
	</Popover>
{/snippet}

<nav class="flex items-center justify-between flex-wrap preset-filled-primary-500 p-6 text-primary-50">
	<div class="flex items-center flex-shrink-0 mr-6">
		<a href="/" class="font-semibold text-xl tracking-tight mr-5">
			RotaryKit
			{#if page.url.pathname.includes("/admin")}
				<span class="text-sm text-success-500">Admin</span>
			{/if}
		</a>
		<a href="/" class="btn btn-sm hover:preset-filled-primary-500">
            Home
        </a>
	</div>
	<div class="block lg:hidden">
		<button
			class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
		>
			<svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
				><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg
			>
		</button>
	</div>
	<div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
		<div class="text-sm lg:flex-grow"></div>
		<div class="hidden lg:block">
			{#if !page.data.user}
				<div class="text-sm lg:flex-grow">
					<a href="/login" class="btn btn-sm">
						<Icon icon="mdi:login" class="mr-2 inline-block" />
						Login
					</a>
					<a href="/register" class="btn btn-sm preset-filled-secondary-500">
						<Icon icon="mdi:account-plus" class="mr-2 inline-block" />
						Register
					</a>
				</div>
			{:else}
				{@render accountMenu()}
			{/if}
		</div>
	</div>
</nav>
