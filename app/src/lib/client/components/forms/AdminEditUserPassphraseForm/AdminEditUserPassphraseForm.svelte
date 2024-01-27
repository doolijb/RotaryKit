<script lang="ts">
	import { FormBase, PassphraseInput } from "$components"
	import { AdminEditUserPassphrase as Form } from "$validation/forms"
	import generator from "generate-password"

	export let disabled: boolean
	export let canSubmit: boolean
	// export let result: SelectUser
	export let form = Form.init()
	export let data: Form["Data"] = {
		passphrase: "",
		passphraseConfirm: "",
	}
	export let errors: FormErrors

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
		data.passphrase = passphrase
	}

</script>

<FormBase
	bind:form
	bind:errors
	bind:data
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
			bind:value={data.passphrase}
			bind:fieldValidator={form.fields.passphrase}
			bind:fieldErrors={errors.passphrase}
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
