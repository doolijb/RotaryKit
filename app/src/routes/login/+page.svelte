<script lang="ts">
	import {UserLoginForm} from "@components"
    import axios from "axios"

    let completed = false

    async function handleSubmit () {
        const response = await axios.post("/api/login", formData)
        if (response.status === 200) {
            completed = true
        }
    }

    let formData = {}
    let formErrors = {}

</script>

<UserLoginForm on:submit={handleSubmit} bind:formData bind:formErrors />