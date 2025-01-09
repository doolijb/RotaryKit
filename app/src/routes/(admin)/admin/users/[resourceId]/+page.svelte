<script lang="ts">
	import { AdminResultDetailView } from "$client/components"
	import { page } from "$app/stores"
	import api from "$shared/api"
	import byteSize from "byte-size"

	const resource = "users"
    const resourceApi = api.admin.users as ResourceApi
	const dataHandlers = {}
	const naturalKey = "username"
	const resourceId = $page.params.resourceId

	type Result = SelectUser & {
		profileImages: SelectImage[]
		toAdminRoles: { adminRole: SelectAdminRole & {
			toAdminPermissions: { adminPermission: SelectAdminPermission }[]
		}}[]
		toAdminPermissions: { adminPermission: SelectAdminPermission }[]
		emails: SelectEmail[]
	}

	const mutateResult = (result:Result) => {
		const retResult = {
			...result,
			profileImage: {} as SelectImage,
			permissions: 0,
			adminRoles: [],
			adminPermissions: [],
		}

		if (result.profileImages.length) {
			retResult.profileImage = result.profileImages[0]
		}

		Object.values(retResult.toAdminRoles).forEach(({ adminRole }) => {
			retResult.permissions = adminRole.toAdminPermissions.length
            Object.values(adminRole.toAdminPermissions).forEach(
				({ adminPermission }: { adminPermission: SelectAdminPermission }) => {
					console.log(adminPermission)
					if (!retResult.adminPermissions.includes(adminPermission)) {
						retResult.adminPermissions.push(adminPermission)
					}
				}
			)
			delete adminRole.toAdminPermissions
            retResult.adminRoles.push(adminRole)
		})

		delete retResult.profileImages
        delete retResult.toAdminRoles
		delete retResult.toAdminPermissions
        return retResult
	}
</script>

<AdminResultDetailView {resource} {resourceApi} {dataHandlers} {naturalKey} {resourceId} {mutateResult} />
 
