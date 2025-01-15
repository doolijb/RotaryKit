<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton-svelte"
    import { ImageView } from "$client/components"

    ////
    // PROPS
    ////

    interface Props {
        // Props
        user: Partial<SelectUser> & { profileImages: Partial<SelectImage>[] }
        width?: string
        class?: string
    }

    let {
        // Props
        user,
        width = "w-10",
        class: className,
    }: Props = $props()

    ////
    // COMPUTED
    ////

    let profileImage = $derived(user.profileImages.length ? user.profileImages[0] : undefined)
    let displayName = $derived(user.displayName || user.username)

</script>

    <div class="relative">
        <Avatar class={className} {width} background="bg-tertiary-400-500-token relative" initials={profileImage ? undefined: displayName}>
            {#if profileImage}
                <ImageView result={profileImage} />
            {/if}
        </Avatar>
    </div>