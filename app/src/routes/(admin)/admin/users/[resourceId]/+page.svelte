<script lang="ts">
	import { AdminResultDetailView } from "$components"
	import { page } from "$app/stores"

	const resource = "users"
	const dataHandlerSet = {}
	const naturalKey = "username"
	const resourceId = $page.params.resourceId

	const mutateResult = (result: SelectUser) => {
        result.adminRoles = []
		result.adminPermissions = []
		Object.values(result.toAdminRoles).forEach(({ adminRole }: { adminRole: SelectAdminRole }) => {
			adminRole.permissions = adminRole.toAdminPermissions.length
            Object.values(adminRole.toAdminPermissions).forEach(
				({ adminPermission }: { adminPermission: SelectAdminPermission }) => {
					result.adminPermissions.push(adminPermission)
				}
			)
            delete adminRole.toAdminPermissions
            result.adminRoles.push(adminRole)
            
		})
        delete result.toAdminRoles
        return result
	}
</script>

<AdminResultDetailView {resource} {dataHandlerSet} {naturalKey} {resourceId} {mutateResult} />
