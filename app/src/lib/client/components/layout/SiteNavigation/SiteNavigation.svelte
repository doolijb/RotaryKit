<script lang="ts">
	import { page } from "$app/stores"
	import Icon from "@iconify/svelte"
	import { popup, type PopupSettings } from "@skeletonlabs/skeleton"

	const navUserPopup: PopupSettings = {
		target: "navUserPopup",
		event: "focus-click",
		placement: "bottom"
	}
</script>

<div
	data-popup="navUserPopup"
	class="card variant-soft bg-surface-500/95 shadow-xl z-50 p-4 select-none"
>
	<!-- This is a visually pleasing dropdown/popup with logout, profile, settings, admin links -->
	<div class="flex flex-col">
		<a
			href="/profile"
			class="text-surface-50 hover:text-surface-900 py-2 px-4 block whitespace-no-wrap"
		>
			<Icon icon="mdi:user" class="mr-2 inline-block" />
			Profile
		</a>
		<!-- <a href="/settings" class="text-surface-50 hover:text-surface-900 py-2 px-4 block whitespace-no-wrap">
      Settings
    </a> -->
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
</div>

<nav class="flex items-center justify-between flex-wrap variant-filled-primary p-6 text-primary-50">
	<div class="flex items-center flex-shrink-0 mr-6">
		<a href="/" class="font-semibold text-xl tracking-tight mr-5">
			{#if $page.url.pathname.includes("/admin")}
				<Icon icon="mdi:shield" class="mr-2 inline-block" />
				Admin Dashboard
			{:else}
				<Icon icon="teenyicons:svelte-solid" class="mr-2 inline-block" />
				SvelteKit Template
			{/if}
		</a>
		<a href="/" class="btn btn-sm hover:variant-filled-primary">
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
			{#if !$page.data.user}
				<div class="text-sm lg:flex-grow">
					<a href="/login" class="btn btn-sm hover:variant-filled-primary">
						<Icon icon="mdi:login" class="mr-2 inline-block" />
						Login
					</a>
					<a href="/register" class="btn btn-sm variant-filled-secondary">
						<Icon icon="mdi:account-plus" class="mr-2 inline-block" />
						Register
					</a>
				</div>
			{:else}
				<button
					use:popup={navUserPopup}
					class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
				>
					{$page.data.user.username}
				</button>
			{/if}
		</div>
	</div>
</nav>
