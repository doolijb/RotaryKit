<script lang="ts">
	import { AdminResultDetailView } from "$client/components"
	import { page } from "$app/stores"
	import api from "$shared/api"

	const resource = "users"
    const resourceApi = api.admin.users as ResourceApi
	const dataHandlerSet = {}
	const naturalKey = "username"
	const resourceId = $page.params.resourceId

	type Result = SelectUser & {
		toAdminRoles: { adminRole: SelectAdminRole & {
			toAdminPermissions: { adminPermission: SelectAdminPermission }[]
		}}[]
		toAdminPermissions: { adminPermission: SelectAdminPermission }[]
		emails: SelectEmail[]
	}

	const mutateResult = (result:Result) => {
		const retResult = {
			...result,
			permissions: 0,
			adminRoles: [],
			adminPermissions: [],
		}
		console.log("retResult", retResult)

		Object.values(retResult.toAdminRoles).forEach(({ adminRole }) => {
			retResult.permissions = adminRole.toAdminPermissions.length
            Object.values(adminRole.toAdminPermissions).forEach(
				({ adminPermission }: { adminPermission: SelectAdminPermission }) => {
					retResult.adminPermissions.push(adminPermission)
				}
			)
            retResult.adminRoles.push(adminRole)
		})

        delete retResult.toAdminRoles
		delete retResult.toAdminPermissions
        return retResult
	}
</script>

<AdminResultDetailView {resource} {resourceApi} {dataHandlerSet} {naturalKey} {resourceId} {mutateResult} />
