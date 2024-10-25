<script lang="ts">
    import { page } from "$app/stores"

    export let result: SelectImage
    export let alt: string | undefined = undefined
    export let size: "small" | "medium" | "large" | "original" = "large"

    const sources: { type: string, srcset: string }[] = []

    function addSmall() {
        if (result.smallWebpPath) {
            sources.push({ type: "image/webp", srcset: result.smallWebpPath })
        }
        if (result.smallJpgPath) {
        sources.push({ type: "image/jpg", srcset: result.smallJpgPath })
        }
    }

    function addMedium() {
        if (result.mediumWebpPath) {
            sources.push({ type: "image/webp", srcset: result.mediumWebpPath })
        }
        if (result.mediumJpgPath) {
            sources.push({ type: "image/jpg", srcset: result.mediumJpgPath })
        }
    }

    function addLarge() {
        if (result.webpPath) {
            sources.push({ type: "image/webp", srcset: result.webpPath })
        }
        if (result.jpgPath) {
            sources.push({ type: "image/jpg", srcset: result.jpgPath })
        }
    }

    function addOriginal() {
        if (result.originalPath) {
            sources.push({ type: "", srcset: result.originalPath })
        }
    }

    switch (size) {
        case "small":
            addSmall()
            addMedium()
            addLarge()
            addOriginal()
            break
        case "medium":
            addMedium()
            addLarge()
            addSmall()
            addOriginal()
            break
        case "large":
            addLarge()
            addMedium()
            addSmall()
            addOriginal()
            break
        case "original":
            addOriginal()
            addLarge()
            addMedium()
            addSmall()
            break
    }

</script>


<picture>
    {#each sources as { type, srcset }, i}
        <source type={type} srcset={$page.data.storageUrl + srcset} />
    {/each}
    <img src={$page.data.storageUrl + result.smallJpgPath} alt={ alt || result.title } class="{$$props.class}" on:click />
</picture>
    
    
