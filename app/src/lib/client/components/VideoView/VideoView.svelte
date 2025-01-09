<script lang="ts">
    import { page } from "$app/stores"

    ////
    // PROPS
    ////

    interface Props {
        // Props
        result: SelectVideo

        // Rest
        [key: string]: any
    }

    let {
        // Props
        result,


        // Rest
        ...restProps
    }: Props = $props()

    ////
    // CONSTANTS
    ////

    let sources: { type: string, srcset: string }[] = $state([])
    
    ////
    // LIFECYCLE
    ////

    const videoType = `video/${result.originalPath.split('.').pop()}`

</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video { ...restProps } controls>
    <source src={$page.data.storageUrl + result.originalPath} type={videoType} />
    Your browser does not support the video tag.
</video>

    
    
