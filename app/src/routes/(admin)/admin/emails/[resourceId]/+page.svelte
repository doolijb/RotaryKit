<script lang="ts">
	import { AdminResultDetailView } from "$client/components"
	import { page } from "$app/stores"
	import api from "$shared/api"

	const resource = "emails"
    const resourceApi = api.admin.emails as ResourceApi
	const dataHandlerSet = {}
	const naturalKey = "address"
	const resourceId = $page.params.resourceId

	const mutateResult = (result: SelectEmail & {user:SelectUser & {emails?: SelectEmail[], primaryEmailAddress?: string}}) => {
        result.user.primaryEmailAddress = (result.user.emails.find((email) => email.isUserPrimary)).address
        delete result.user.emails
        return result
	}
</script>

<AdminResultDetailView {resource} {resourceApi} {dataHandlerSet} {naturalKey} {resourceId} {mutateResult} />
