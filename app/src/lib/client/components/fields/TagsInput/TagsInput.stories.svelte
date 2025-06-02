<script module>
	import { defineMeta, Meta, type Args } from "@storybook/addon-svelte-csf"
    import TagsInput from "."
    import { FormSchema } from "$shared/validation/base"
    import { validators as v } from "$shared/validation"
    import { FormBase } from "$client/components"

	const suggestions = [
            { label: "Elephant", value: "elephant" },
            { label: "Lion", value: "lion" },
            { label: "Tiger", value: "tiger" },
            { label: "Giraffe", value: "giraffe" },
            { label: "Zebra", value: "zebra" },
            { label: "Hippo", value: "hippo" }
        ]

	const { Story } = defineMeta({
        component: TagsInput,
        tags: ["autodocs"],
        argTypes: {
            Form: {
                type: "object"
            }
        },
        args: {
            field: "tagsInput",
            // getOptions,
            // mapOptions
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
			tagsInput: v.Array.init()
		};
		fieldAttributes = {
			tagsInput: {
				label: "Modal Select Field"
			}
		}
		optional = { tagsInput: true };
	}

    class WithValidatorsForm extends FormSchema {
        fields = {
            tagsInput: v.Array.init().minLength({minLen: 2}).maxLength({maxLen: 8 }).maxCount({maxCount: 8 }).minCount({minCount: 2 })
        };
        optional = {};
        fieldAttributes = {
            tagsInput: {
                label: "Modal Select Field",
            }
        }
    }

</script>

{#snippet template(args: Args<typeof Story>, ctx)}
    {@const form = ctx.parameters.Form.init({ data: ctx.parameters.data || {} })}
    <FormBase {form} showCancel={false} showSubmit={false}>
        <TagsInput 
            {...args} 
            disabled={args.disabled} 
            {form} 
            field={args.field} 
            />
    </FormBase>
{/snippet}

<Story name="Default" parameters={{ Form: DefaultForm }} />

<Story name="With suggestions" parameters={{ Form: DefaultForm }} args={{ suggestions }} />

<Story name="With validators" parameters={{ Form: WithValidatorsForm }} args={{ suggestions }} />