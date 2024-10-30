import React from "react"
import { EmailBase } from "../EmailBase"

export const PassphraseUpdatedConfirmation = ({
	subject,
	name
}: {
	subject: string
	name: string
}) => {
	const Main = (
		<>
			<p>
				<b>
					Hello {name},
					<br />
					This message is to confirm that your passphrase was successfully changed.
				</b>
			</p>
		</>
	)

	return <EmailBase subject={subject} Main={Main} />
}
