import type { ComponentType } from "svelte"
import { v4 as uuid } from "uuid"

import type { Meta } from "@storybook/svelte"

import Component from "."

const meta: Meta<typeof Component> = {
    argTypes: {} as any,
    component: Component as ComponentType,
    decorators: [],
    tags: ["autodocs"],
    parameters: {
        sveltekit_experimental: {
			stores: {
				page: {
					data: {
                        user: {
                            id: uuid(),
                            username: "JackSparrow",
                            isActive: true,
                            verifiedAt: new Date(),
                            isAdmin: true,
                            isSuperUser: false,
                            emails: [
                                {
                                    id: uuid(),
                                    address: "jack.sparrow@example.com",
                                    verifiedAt: new Date()
                                }
                            ]
                        } as SelectUser
                    }
				},
			},
		}
    }
}

export default meta

const Template = (args: {value: boolean}) => ({
    Component,
    props: args
})

export const Default = {
    args: {},
    render: Template
}