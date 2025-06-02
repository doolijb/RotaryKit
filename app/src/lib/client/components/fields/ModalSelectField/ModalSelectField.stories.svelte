<script module>
    import { defineMeta, Meta, type Args } from "@storybook/addon-svelte-csf"
    import ModalSelectField from "."
    import { FormSchema } from "$shared/validation/base"
    import { validators as v } from "$shared/validation"
    import { FormBase } from "$client/components"

    async function getOptions({ search }: {search?: string}) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const options = [
            { id: 1, title: "Elephant" },
            { id: 2, title: "Lion" },
            { id: 3, title: "Tiger" },
            { id: 4, title: "Giraffe" },
            { id: 5, title: "Zebra" },
            { id: 6, title: "Hippo" }
        ]
        if (search) {
            return options.filter((option) => option.title.toLowerCase().includes(search.toLowerCase()) || `${option.id}` === search)
        } else {
            return options
        }
    }

    function mapOptions(options) {
        return options.map((option) => ({
            value: option.id,
            label: option.title
        }))
    }

    const { Story } = defineMeta({
        component: ModalSelectField,
        tags: ["autodocs"],
        argTypes: {
            Form: {
                type: "object"
            }
        },
        args: {
            field: "modalSelect",
            getOptions,
            mapOptions
        },
        parameters: {
            controls: {
                exclude: ["Form"]
            },
            Form: {
                type: "object"
            }
        },
        // @ts-ignore - See https://github.com/storybookjs/addon-svelte-csf/pull/295
        render: template
    })
</script>

<script lang="ts">

    class DefaultForm extends FormSchema {
        fields = {
            modalSelect: v.Number.init()
        };
        fieldAttributes = {
            modalSelect: {
                label: "Modal Select Field"
            }
        }
        optional = { modalSelect: true };
    }

    class WithValidatorsForm extends FormSchema {
        fields = {
            modalSelect: v.Number.init()
        };
        optional = {};
        fieldAttributes = {
            modalSelect: {
                label: "Modal Select Field",
            }
        }
    }

    class WithPlaceholderForm extends FormSchema {
        fields = {
            modalSelect: v.Number.init()
        };
        optional = {};
        fieldAttributes = {
            modalSelect: {
                label: "Modal Select Field",
                placeholder: "This is a placeholder",
            }
        }
    }

    class WithDescriptionForm extends FormSchema {
		fields = {
			modalSelect: v.Number.init()
		}
		optional = {modalSelect: true}
		fieldAttributes = {
			modalSelect: {
				label: "Rich Text",
				description:
					"You can add additional information about how your users should fill out this field through the form schema."
			}
		}
	}
</script>

{#snippet template(args: Args<typeof Story>, ctx)}
    {@const form = ctx.parameters.Form.init({ data: ctx.parameters.data || {} })}
    <FormBase {form} showCancel={false} showSubmit={false}>
        <ModalSelectField 
            {...args} 
            mapOptions={args.mapOptions} 
            getOptions={args.getOptions} 
            disabled={args.disabled} 
            {form} 
            field={args.field} 
            />
    </FormBase>
{/snippet}

<Story name="Default" parameters={{ Form: DefaultForm }} />

<Story name="Disabled" args={{ disabled: true }} parameters={{ Form: DefaultForm }} />

<Story name="Disabled With Value" args={{ disabled: true }} parameters={{ Form: DefaultForm, data: { modalSelect: 3 } }} />

<Story name="Filled" parameters={{ Form: DefaultForm, data: { modalSelect: 3 } }} />

<Story name="With Validators" parameters={{ Form: WithValidatorsForm }} />

<Story name="Filled with Validators" parameters={{ Form: WithValidatorsForm, data: { modalSelect: 3 } }} />

<Story name="With Placeholder" parameters={{ Form: WithPlaceholderForm }} />

<Story name="With Description (Prop)" args={{description: "You can add additional information about how your users should fill out this field through props."}} parameters={{ Form: DefaultForm }} />

<Story name="With Description (Schema)" parameters={{ Form: WithDescriptionForm }} />