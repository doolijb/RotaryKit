<script lang="ts">
	/**
	 * Verification email
	*/
	// TODO: Switch to react-email, this lib is dead
    /// https://github.com/carstenlebek/svelte-email/issues/25
    // import { Text } from "svelte-email"
	const Text = undefined
	import EmailBase from "../EmailBase"

	export let subject: string
	export let name: string
	export let url: string
	export let expiresAt: string|undefined

	let styles

</script>

<EmailBase bind:styles {subject}>
	<div slot="main" >
		<Text>
			<b>
				Hello {name},
				<br/>
				Click the link below to verify your email address:
			</b>
		</Text>
		<a  
			href={url}
			target="_blank"
			style={styles?.button}
		>
			Verify your email
		</a>
		<Text>
			Or copy and paste this link into your browser:
			<br/>
			<span>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50" style="display:inline">
				<polyline points="15,10 35,25 15,40" stroke="#000" stroke-width="4" fill="none" />
			</svg> {url}
		</span>
		</Text>
		{#if expiresAt}
			<Text>
				<b>
					<!-- Parse date and print out readable format with time zone -->
					This link will expire on {new Date(expiresAt).toLocaleString("en-US", { timeZoneName: "short" })}
				</b>
			</Text>
		{/if}
	</div>
	<div slot="footer">
		<Text>
			<center>
				<small>
					<i>
						If this email was sent to you by mistake, you may ignore it.
					</i>
				</small>
			</center>
		</Text>
	</div>
</EmailBase>