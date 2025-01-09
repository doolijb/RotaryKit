<script lang="ts">
	import { AdminResultDetailView } from "$client/components"
	import { page } from "$app/stores"
	import api from "$shared/api"

	const resource = "images"
    const resourceApi = api.admin.images as ResourceApi
	const dataHandlers = {
		tabType: "image"
	}
	const naturalKey = "title"
	const resourceId = $page.params.resourceId

	const mutateResult = (result: SelectImage) => {
	}
</script>

<AdminResultDetailView {resource} {resourceApi} {dataHandlers} {naturalKey} {resourceId} />
