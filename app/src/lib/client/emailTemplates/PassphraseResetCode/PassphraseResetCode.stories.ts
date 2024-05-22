import { faker } from "@faker-js/faker"
import type { Meta } from "@storybook/svelte"
import ReactComponent from 'svelte-react'
import { PassphraseResetCode } from '.'

const meta: Meta<typeof ReactComponent> = {
	component: ReactComponent as any,
	tags: ["autodocs"],
	argTypes: {},
	parameters: {
		skipThemeProvider: true,
	}
}

export default meta

const Template = (args:Parameters<typeof PassphraseResetCode>) => ({
	Component: ReactComponent,
	props: {
		...args,
		this: PassphraseResetCode,
	}
})

type Args = Parameters<typeof PassphraseResetCode>[0]

export const Default = Template.bind({})

Default.args = {
	subject: "Email Verification Code",
	name: faker.internet.userName(),
	url: `http://example.com/api/verify/email/${faker.string.uuid()}`,
} as Args
