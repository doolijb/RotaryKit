import React from "react"
import { EmailBase } from "../EmailBase"
import { CodeInline } from "@react-email/code-inline"

export const PassphraseResetCode = ({
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
					You've requested to reset your passphrase, click the link below to continue:
				</b>
			</p>
			<center>
				<a className="button" href={url} target="_blank">
					Reset your passphrase
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

	const Footer = (
		<>
			<p>
				<center>
					<small>
						<i>If this email was sent to you by mistake, you may ignore it.</i>
					</small>
				</center>
			</p>
		</>
	)

	return <EmailBase subject={subject} Main={Main} Footer={Footer} />
}
