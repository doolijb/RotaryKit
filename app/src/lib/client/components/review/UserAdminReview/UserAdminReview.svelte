<script lang="ts">
    import {ReviewModes} from "$shared/constants"
    import {onMount} from "svelte"


    interface Props {
        formData?: any;
        mode?: string;
        user?: SelectUser | undefined | null;
    }

    let { formData = $bindable({
        user: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: ""
        }
    }), mode = ReviewModes.CREATE, user = null }: Props = $props();

    const invalidFields: string[] = ["username"]

    onMount(() => {
        if (user && mode === ReviewModes.EDIT) {
            formData.user = {
                ...formData.user,
                ...user
            }
        }
    })
</script>

<!-- USERNAME -->
<div class="my-4 flex flex-row">
    <label class="label mx-2 grow">
        <span>Username</span>
        {#if mode === ReviewModes.CREATE || mode === ReviewModes.EDIT}
            <input
                class="variant-form-material input"
                class:input-error={invalidFields.includes("username")}
                type="text"
                bind:value={formData.user.username}
            />
        {:else if mode === ReviewModes.VIEW && user}
            <div class="variant-form-material input">
                {user.username}
            </div>
        {/if}
    </label>
</div>

<!-- EMAIL ADDRESS -->
<div class="my-4 flex flex-row">
    <label class="label mx-2 grow">
        <span>Email Address</span>
        <input
            bind:value={formData.user.email}
            class="variant-form-material input"
            class:input-error={invalidFields.includes("email")}
            type="email"
        />
    </label>
</div>

<div class="my-4 flex flex-row">
    <label class="label mx-2 grow">
        <span>Password</span>
        <input
            bind:value={formData.user.email}
            class="variant-form-material input"
            class:input-error={invalidFields.includes("email")}
            type="email"
        />
    </label>
</div>
