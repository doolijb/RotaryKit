<script lang="ts">
	import byteSize from "byte-size"
	import { ImageView, DetailGridItem } from "$client/components"
	import { page } from "$app/stores"
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";

    const modalStore = getModalStore()

	export let result: SelectImage

	function getValue(key) {
		switch (key) {
			case "originalPath":
			case "webpPath":
			case "jpgPath":
			case "mediumWebpPath":
			case "mediumJpgPath":
			case "smallWebpPath":
			case "smallJpgPath":
				return result[key] ? $page.data.storageUrl + result[key] : false
			case "totalBytes":
			case "originalBytes":
			case "webpBytes":
			case "jpgBytes":
			case "mediumWebpBytes":
			case "mediumJpgBytes":
			case "smallWebpBytes":
			case "smallJpgBytes":
				return result[key] ? byteSize(result[key]).toString() : false
			default:
				return result[key]
		}
	}

	function getLabel(key) {
		switch (key) {
			case "originalPath":
				return "View original"
			case "webpPath":
				return "View WebP"
			case "jpgPath":
				return "View JPG"
			case "mediumWebpPath":
				return "View Medium WebP"
			case "mediumJpgPath":
				return "View Medium JPG"
			case "smallWebpPath":
				return "View Small WebP"
			case "smallJpgPath":
				return "View Small JPG"
			case "totalBytes":
				return "Total Size"
			case "originalBytes":
				return "Original Size"
			case "webpBytes":
				return "Large WebP size"
			case "jpgBytes":
				return "Large JPG size"
			case "mediumWebpBytes":
				return "Medium WebP size"
			case "mediumJpgBytes":
				return "Medium JPG size"
			case "smallWebpBytes":
				return "Small WebP size"
			case "smallJpgBytes":
				return "Small JPG size"
			default:
				return key
		}
	}

    function onImageClick() {
        const modal: ModalSettings = {
            type: 'component',
            component: 'imageViewerModal',
            meta: {
                result: result
            }
        };
        modalStore.trigger(modal);
    }

</script>

<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
	<DetailGridItem label="Preview" class="row-span-3">
        <ImageView {result} size="small" class="rounded cursor-pointer" on:click={onImageClick} />
	</DetailGridItem>
    <DetailGridItem label={getLabel("id")} value={getValue("id")} />
    <DetailGridItem label={getLabel("title")} value={getValue("title")}/>
    <DetailGridItem label={getLabel("createdAt")} value={getValue("createdAt")} />
    <DetailGridItem label={getLabel("updatedAt")} value={getValue("updatedAt")} />
    <DetailGridItem label={getLabel("status")} value={getValue("status")} />
	<DetailGridItem label={getLabel("totalBytes")} value={getValue("totalBytes")} />
	<hr class="border-gray-200 col-span-3" />
    {#if result.originalPath}
        <DetailGridItem label={getLabel("originalPath")} value={getValue("originalPath")}  humanizeLabel={false}/>
        <DetailGridItem label={"Size"} value={getValue("originalBytes")}  humanizeLabel={false}/>
    {:else}
        <DetailGridItem label="Original" value="Unavailable" />
    {/if}
    {#each ["webp", "jpg", "mediumWebp", "mediumJpg", "smallWebp", "smallJpg"] as key}
    <hr class="border-gray-200 col-span-3" />
        <DetailGridItem label={key} value={!!getValue(key + "Path") ? "Available" : "Unavailable"}/>
        {#if result[key + "Path"]}
            <DetailGridItem label={"View"} value={getValue(key + "Path")}  humanizeLabel={false}/>
            <DetailGridItem label={"Size"} value={getValue(key + "Bytes")}  humanizeLabel={false}/>
        {/if}
    {/each}

</div>
