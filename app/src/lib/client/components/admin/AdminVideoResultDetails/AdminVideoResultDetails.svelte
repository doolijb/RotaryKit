<script lang="ts">
	import byteSize from "byte-size"
	import { DetailGridItem, VideoView } from "$client/components"
	import { page } from "$app/state"

	interface Props {
		result: SelectImage;
	}

	let { result }: Props = $props();

	function getValue(key) {
		switch (key) {
			case "originalPath":
				return result[key] ? page.data.storageUrl + result[key] : false
			case "originalBytes":
				return result[key] ? byteSize(result[key]).toString() : false
			default:
				return result[key]
		}
	}

	function getLabel(key) {
		switch (key) {
			case "originalPath":
				return "View original"
			default:
				return key
		}
	}

</script>

<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
	<DetailGridItem label="Preview" class="row-span-3 mb-4">
		<VideoView result={result} class="w-full h-full" />
	</DetailGridItem>
    <DetailGridItem label={getLabel("id")} value={getValue("id")} />
    <DetailGridItem label={getLabel("title")} value={getValue("title")}/>
    <DetailGridItem label={getLabel("createdAt")} value={getValue("createdAt")} />
    <DetailGridItem label={getLabel("updatedAt")} value={getValue("updatedAt")} />
    <DetailGridItem label={getLabel("status")} value={getValue("status")} />
	<!-- <DetailGridItem label={getLabel("totalBytes")} value={getValue("totalBytes")} /> -->
	<hr class="border-gray-200 col-span-3" />
	<DetailGridItem label="Original" >
		<span class:opacity-50={!getValue("originalPath")}>
			{getValue("originalPath") ? "Available" : "Unavailable"}
		</span>
	</DetailGridItem>
    {#if result.originalPath}
        <DetailGridItem label={getLabel("originalPath")} value={getValue("originalPath")}  humanizeLabel={false}/>
        <DetailGridItem label={"Size"} value={getValue("originalBytes")}  humanizeLabel={false}/>
	{/if}

</div>
