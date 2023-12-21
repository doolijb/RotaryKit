<script lang="ts">
	import { FormBase, PassphraseInput } from "@components"
	import { forms, utils } from "@validation"
	import generator from "generate-password"

	export let disabled = false
	export let result: SelectUser

	export let formData: { [key: string]: any } = {
		passphrase: ""
	}

	export let formErrors: FormErrors = {}
	export let canSubmit: boolean

	const definitions = forms.adminEditUserPassphrase
	export let formValidator: FormValidator = utils.formValidator({
		definitions
	})

	/**
	 * Generates a passphrase and copies it to the clipboard.
	 * Passphrase should be long and random enough to be secure.
	 * Requires a special character and number.
	*/
	function generatePassphrase() {
		const passphrase = generator.generate({
			length: 20,
			numbers: true,
			symbols: true,
			excludeSimilarCharacters: true,
			uppercase: true,
		})
		navigator.clipboard.writeText(passphrase)
		formData.passphrase = passphrase
	}

</script>

<FormBase
	bind:formValidator
	bind:formErrors
	bind:formData
	bind:canSubmit
	on:submit
	on:cancel
	showSubmit={false}
	showCancel={false}
>
	<div class="flex">
		<PassphraseInput
			label="Set New Passphrase"
			id="passphrase"
			bind:value={formData.passphrase}
			bind:fieldValidator={formValidator.fields.passphrase}
			{disabled}
		/>
		<div>
		<button
			type="button"
			on:click={generatePassphrase}
			class="btn variant-filled-secondary">
			Generate
		</button>
	</div>
	</div>
</FormBase>
