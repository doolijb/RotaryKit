<script lang="ts">
	import {EmailBase }from "../EmailBase/EmailBase"

	export let subject: string
	export let username: string
	export let url: string
	export let expiresAt: string|undefined
	
	let styles

</script>

<EmailBase bind:styles {subject}>
	<div slot="main" >
		<p>
			<b>
				Hello {username},
				<br/>
				You've requested to reset your passphrase, click the link below to continue:
			</b>
		</p>
		<a  
			href={url}
			target="_blank"
			style={styles?.button}
		>
			Reset your passphrase
		</a>
		<p>
			Or copy and paste this link into your browser:
			<br/>
			<span>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50" style="display:inline">
				<polyline points="15,10 35,25 15,40" stroke="#000" stroke-width="4" fill="none" />
			</svg> {url}
		</span>
		</p>
		{#if expiresAt}
			<p>
				<b>
					<!-- Parse date and print out readable format with time zone -->
					This link will expire on {new Date(expiresAt).toLocaleString("en-US", { timeZoneName: "short" })}
				</b>
			</p>
		{/if}
	</div>
	<div slot="footer">
		<p>
			<center>
				<small>
					<i>
						If this email was sent to you by mistake, you may ignore it.
					</i>
				</small>
			</center>
		</p>
	</div>
</EmailBase>