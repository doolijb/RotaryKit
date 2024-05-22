import { faker } from "@faker-js/faker"
import type { Meta } from "@storybook/svelte"
import ReactComponent from 'svelte-react'
import { PassphraseUpdatedConfirmation } from '.'

const meta: Meta<typeof ReactComponent> = {
	component: ReactComponent as any,
	tags: ["autodocs"],
	argTypes: {},
	parameters: {
		skipThemeProvider: true,
	}
}

export default meta

const Template = (args:Parameters<typeof PassphraseUpdatedConfirmation>) => ({
	Component: ReactComponent,
	props: {
		...args,
		this: PassphraseUpdatedConfirmation,
	}
})

type Args = Parameters<typeof PassphraseUpdatedConfirmation>[0]

export const Default = Template.bind({})

Default.args = {
	subject: "Your Passphrase Has Been Updated",
	name: faker.internet.userName(),
} as Args
