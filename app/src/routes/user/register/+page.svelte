<script lang="ts">
	import {UserRegisterForm} from "@components"
    import axios from "axios"

    async function onSubmit () {
        const response = await axios.post("/api/user/register", formData)
        console.log("response", response)
        if (response.status === 200) {
            completed = true
        }
    }

    let completed = false
    let formData = {
        email: "",
        passphrase: "",
        passphraseConfirm: "",
    }
    let formErrors = {
        email: {},
        passphrase: {},
        passphraseConfirm: {},
    }

</script>

<!-- Nice rounded wrapper, centered, fixed width at full screen, responsive -->
<container class="container">
    {#if !completed}
        <UserRegisterForm {onSubmit} bind:formData bind:formErrors />
    {:else}
        <div class="flex flex-col items-center justify-center space-y-4">
            <h1 class="text-2xl font-bold">Thank you for registering!</h1>
            <p class="text-lg">A confirmation link will be sent to <u>{formData.email || "your email"}</u>. </p>
        </div>
    {/if}
</container>