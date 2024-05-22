import React from "react"
import { EmailBase } from "../EmailBase"
import { CodeInline } from "@react-email/code-inline"
import styles from "../EmailBase/styles"

export const EmailVerificationCode = ({
	subject,
	name,
	url,
	expiresAt
}: {
	subject: string
	name: string
	url: string
	expiresAt?: number
}) => {
	const Main = (
		<>
			<p>
				<b>
					Hello {name},
					<br />
					Click the link below to verify your email address:
				</b>
			</p>
			<center>
				<a style={{ ...styles.button }} href={url} target="_blank">
					Verify your email
				</a>
			</center>
			<p>
				Or copy and paste this link into your browser:
				<br />
				<CodeInline>{url}</CodeInline>
			</p>
			{expiresAt && (
				<p>
					<b>
						This link will expire on{" "}
						{new Date(expiresAt).toLocaleString("en-US", { timeZoneName: "short" })}
					</b>
				</p>
			)}
		</>
	)

	return <EmailBase subject={subject} Main={Main} />
}
