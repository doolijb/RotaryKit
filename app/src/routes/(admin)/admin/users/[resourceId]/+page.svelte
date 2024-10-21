<script lang="ts">
	import { AdminResultDetailView } from "$client/components"
	import { page } from "$app/stores"
	import api from "$shared/api"
	import byteSize from "byte-size"

	const resource = "users"
    const resourceApi = api.admin.users as ResourceApi
	const dataHandlerSet = {}
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
			profileImage: {},
			permissions: 0,
			adminRoles: [],
			adminPermissions: [],
		}

		if (result.profileImages.length) {
			retResult.profileImage = result.profileImages[0]
			// Convert jpg bytes to MB
			retResult.profileImage.jpgSize = byteSize(retResult.profileImage.smallJpgBytes).toString()
			retResult.profileImage.webpSize = byteSize(retResult.profileImage.smallJpgBytes).toString()
			delete retResult.profileImage.smallJpgBytes
			delete retResult.profileImage.smallWebpBytes
		}

		Object.values(retResult.toAdminRoles).forEach(({ adminRole }) => {
			retResult.permissions = adminRole.toAdminPermissions.length
            Object.values(adminRole.toAdminPermissions).forEach(
				({ adminPermission }: { adminPermission: SelectAdminPermission }) => {
					retResult.adminPermissions.push(adminPermission)
				}
			)
            retResult.adminRoles.push(adminRole)
		})

		delete retResult.profileImages
        delete retResult.toAdminRoles
		delete retResult.toAdminPermissions
        return retResult
	}
</script>

<AdminResultDetailView {resource} {resourceApi} {dataHandlerSet} {naturalKey} {resourceId} {mutateResult} />
 