<script lang="ts">
	import {UserLoginForm} from "@components"
    import axios from "axios"

    let completed = false

    async function onSubmit () {
        const response = await axios.post("?/login", formData)
        console.log("response", response)
        if (response.status === 200) {
            completed = true
        }
    }

    let formData = {}
    let formErrors = {}

</script>

<UserLoginForm {onSubmit} bind:formData bind:formErrors />