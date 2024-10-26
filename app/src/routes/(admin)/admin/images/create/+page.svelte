<script lang="ts">
    import {AdminCreateView, AdminCreateImageForm} from "$client/components"
	import api from "$shared/api"

    const resource = "images"
    const FormComponent = AdminCreateImageForm
    const resourceApi = api.admin.images as  ResourceApi
    const displayTitle = "Image"

    let extras = $state({})

</script>

<AdminCreateView
    {resource}
    {resourceApi}
    {displayTitle}
    {FormComponent}
    requestBodyType="formData"
    {extras}
/>