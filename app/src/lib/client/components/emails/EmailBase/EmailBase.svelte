<script lang="ts">
	import { setContext } from "svelte"
	/**
	 * Email Base Component
	*/
	import "../../../../../app.postcss"
	import { Html, Text } from "svelte-email"

	export let subject: string = "System Message"

	export const styles = {
		body: "width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 25px 0; font-family: Arial, sans-serif; color: #333333; background-color: #F2F2F2; ",
		backgroundTable: "margin: 0; padding: 0; width: 100%; line-height: 100%;",
		img: "outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;",
		aImg: "border: none;",
		imageFix: "display: block;",
		button: "background-color: #3498db; border: none; color: white; padding: 10px 16px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px;",
		p: "margin: 1em 0;",
		tableTd: "border-collapse: collapse;",
		table: "border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;",
		a: "color: blue;",
		header: "font-weight: bold; margin: 0; padding: 0;",
		main: "padding: 10px; background-color: #F9F9F9; width: 100%; max-width: 600px; display:block; margin: 0 auto; @media (min-width: 768px) { width: auto; }",
	}
</script>

<Html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<title>{subject}</title>
</head>
	<body style={styles.body}>
		<main style={styles.main}>
			<slot name="main"/>
		</main>
		<footer>
			<slot name="footer"/>
			<Text>
				<center>
					<small>
						<i>
							We will never ask you for your password.
						</i>
					</small>
				</center>
			</Text>
		</footer>
	</body>
</Html>