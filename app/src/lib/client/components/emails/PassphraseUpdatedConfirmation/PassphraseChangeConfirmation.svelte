<script lang="ts">
	/**
	 * Verification email
	*/
	import { Text } from "svelte-email"
	import EmailBase from "../EmailBase"

	export let subject: string
	export let name: string

	let styles

</script>

<EmailBase bind:styles {subject}>
	<div slot="main" >
		<Text>
			<b>
				Hello {name},
				<br/>
				This message is to confirm that your passphrase was successfully changed.
			</b>
		</Text>
	</div>
</EmailBase>