<script lang="ts">
	import { page } from "$app/state"
    import { FormBase, PassphraseInput } from "$client/components"
    import { AdminEditUserPassphrase as Form } from "$shared/validation/forms"
    import Icon from "@iconify/svelte"
    import { type ToastContext } from "@skeletonlabs/skeleton-svelte"
	import { getContext } from "svelte"

    ////
    // PROSP
    ////

    interface Props {
        // Props
        result: SelectUser

        // Bindables
        disabled: boolean
        canSubmit: boolean
        form: Form
        data: Form["Data"]
        errors: FormErrors

        // Events
        onsubmit: (e: Event) => Promise<void>
        oncancel: (e: Event) => Promise<void>
    }

    let {
        // Props
        result,

        // Bindables
        disabled = $bindable(false),
        canSubmit = $bindable(false),
        form = $bindable(Form.init()),
        data = $bindable({
            passphrase: "",
        }),
        errors = $bindable({}),

        // Events
        onsubmit,
        oncancel,
    }: Props = $props();

    const toast: ToastContext = getContext("toast")

    /**
     * Generates a random string with the specified length and character set.
     */
    function generateRandomString(length: number, charset: string) {
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
        }
        return randomString;
    }

    /**
     * Generates a passphrase and copies it to the clipboard.
     * Passphrase should be long and random enough to be secure.
     * Requires a special character and number.
     */
    function generatePassphrase() {
        const charsets = [
			"abcdefghijklmnopqrstuvwxyz", 
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"0123456789",
			"!@#$%^&*()_+~`|}{[]:;?><,./-=",
	]
		let passphrase = ""
        charsets.forEach((set: string) => {
			passphrase += generateRandomString(6, set)
		})
        // Scramble the passphrase
		passphrase = passphrase.split('').sort(() => Math.random() - 0.5).join('');
        data.passphrase = passphrase;
    }

    /**
     * Copies the passphrase to the clipboard and displays a toast message.
     */
    function copyPassphrase() {
        navigator.clipboard.writeText(data.passphrase);
        toast.create({
            description: "Passphrase copied to clipboard",
            type: "success",
        });
    }
</script>

{#if result && page.data.user.id === result.id}
    <div class="card mb-3 preset-filled-error">
        <section class="p-4">
            <p>
                <Icon icon="icon-park-outline:caution" class="me-1 inline" height="1.5em" /> This user is not an admin.
                Admin roles do not apply.
            </p>
        </section>
    </div>
{/if}

<FormBase
    {form}
    bind:errors
    bind:data
    bind:canSubmit
    {onsubmit}
    {oncancel}
    showSubmit={false}
    showCancel={false}
>
    <div>
        <PassphraseInput
            id="passphrase"
            field="passphrase"
            bind:data
            bind:errors
            {form}
            {disabled}
        />
        <div>
            <button
                type="button"
                onclick={generatePassphrase}
                class="btn preset-filled-secondary">
                <Icon icon="mdi:dice" class="me-2" />
                Generate Random Passphrase
            </button>
            <button
                type="button"
                onclick={copyPassphrase}
				disabled={!data.passphrase && !!Object.keys(errors).length}
                class="btn preset-filled-surface">
                <Icon icon="mdi:clipboard" class="me-2" />
                Copy Passphrase
            </button>
        </div>
    </div>
</FormBase>