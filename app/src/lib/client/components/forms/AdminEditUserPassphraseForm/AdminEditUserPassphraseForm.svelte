<script lang="ts">
	import { page } from "$app/stores"
    import { FormBase, PassphraseInput } from "$client/components"
    import { Toast } from "$client/utils"
    import { AdminEditUserPassphrase as Form } from "$shared/validation/forms"
    import Icon from "@iconify/svelte"
    import { getToastStore } from "@skeletonlabs/skeleton"

    interface Props {
        disabled: boolean;
        canSubmit: boolean;
        result: SelectUser;
        form?: any;
        data?: Form["Data"];
        errors?: FormErrors;
    }

    let {
        disabled,
        canSubmit = $bindable(),
        result,
        form = $bindable(Form.init()),
        data = $bindable({
        passphrase: "",
    }),
        errors = $bindable({})
    }: Props = $props();

    const toastStore = getToastStore()

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
        const toast = new Toast({
            message: "Passphrase copied to clipboard",
            style: "success",
        });
        toastStore.trigger(toast);
    }
</script>

{#if result && $page.data.user.id === result.id}
	<div class="card mb-3">
		<section class="p-4">
			<p class="text-red-500">
				<b>Warning:</b> You are editing your own passphrase.
			</p>
		</section>
	</div>
{/if}

<FormBase
    {form}
    bind:errors
    bind:data
    bind:canSubmit
    on:submit
    on:cancel
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
                class="btn variant-filled-secondary">
                <Icon icon="mdi:dice" class="me-2" />
                Generate Random Passphrase
            </button>
            <button
                type="button"
                onclick={copyPassphrase}
				disabled={!data.passphrase || Object.keys(errors).length > 0}
                class="btn variant-filled-surface">
                <Icon icon="mdi:clipboard" class="me-2" />
                Copy Passphrase
            </button>
        </div>
    </div>
</FormBase>