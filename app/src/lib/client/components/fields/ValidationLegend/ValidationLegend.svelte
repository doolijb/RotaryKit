<script lang="ts">
    import { ValidStates } from "$shared/constants"
	import type { FormSchema, Primitive } from "$shared/validation/base"
    import * as Icon from "lucide-svelte"
	import { Popover } from "@skeletonlabs/skeleton-svelte"
    import humanizeString from "humanize-string"

    ////
    // PROPS
    ////

    interface Props {
        ////
        form: FormSchema
        field: string,
        fieldValidator: Primitive<unknown>
        attrs: FormFieldAttributes | undefined
    }

    let {
        form,
        field,
        fieldValidator,
        attrs,
    }: Props = $props()

    ////
    // CONSTANTS
    ////

    const formCtx = form.getContext()
    const validatorKeys = fieldValidator.validators.map((v) => v.key)

    ////
    // STATE
    ////

    let legendIcon: HTMLDivElement = $state()
    let open = $state(false)
    let responseValidators: FieldErrors = $state({})

    ////
    // CALCULATED
    ////

    let validatorLength = $derived(Object.keys(fieldValidator).length)
    let stickyValidators = $derived(Object.values(fieldValidator.validators).filter((validator) => validator.isSticky && !validator.isHidden))
    let dynamicValidators = $derived(Object.values(fieldValidator.validators).filter((validator) => !validator.isHidden && !validator.isSticky))
    let validators = $derived([...stickyValidators, ...dynamicValidators])

    // Filter out validators that are not in the fieldValidator
    $effect(() => {
		const res: FieldErrors = {}
		if (formCtx.validStates[field] === ValidStates.INVALID) {
			if (formCtx.errors[field] !== undefined) {
				Object.keys(formCtx.errors[field]).forEach((key) => {
					if (!validatorKeys.includes(key)) {
						res[key] = formCtx.errors[field][key]
					}})
			}
			responseValidators = res
		}
	})

</script>

{#snippet icon({Icn, preset})}
    <Icn
        class="pointer-events-none w-[1em] h-[1em] mt-[-0.25em] inline {preset}"
    />
{/snippet}

{#snippet badge({badge, message, isValid})}
    <div>
        <span
            class="badge"
            class:preset-filled-success-500={!isValid}
            class:preset-filled-error-500={!!isValid}
        >
            {badge}
        </span>
    </div>
    <div class="mb-1 ps-2">
        <span class="prose-sm">{message}</span>
    </div>
{/snippet}

{#if validatorLength}
<Popover
    {open}
    onOpenChange={(e) => (open = e.open)}
    positioning={{ placement: 'bottom' }}
    contentBase="card preset-filled-surface-100-900 p-4 space-y-4 max-w-[320px] shadow-xl"
    arrow
    arrowBackground="!bg-surface-100-900"
    zIndex="10"
>
        {#snippet trigger()}
            <!-- svelte-ignore a11y_click_events_have_key_events The event is required for event behavior to work as intended -->
            <!-- We need to execute the attached event, and prevent populating up on click -->
            <div
                class="cursor-pointer max-h-[1em] inline {formCtx.validStates[field] === ValidStates.NONE ? "hover:opacity-100 opacity-50" : ""}"
                tabindex="-1"
                bind:this={legendIcon}
                aria-label="Legend"
                title="Click to view legend"
                role="button"
            >
                {#if formCtx.validStates[field] === ValidStates.INVALID}
                    {@render icon({Icn: Icon.AlertCircle, preset: "text-error-500"})}
                {:else if formCtx.validStates[field] === ValidStates.VALID}
                    {@render icon({Icn: Icon.Check, preset: "text-success-700"})}
                {:else}
                    {@render icon({Icn: Icon.Minus, preset: "text-surface-500"})}
                {/if}
            </div>
        {/snippet}
        {#snippet content()}
            <div class="flex flex-col gap-[1em]">
                {#if attrs && attrs.description}
                    <div class="flex flex-col gap-1">
                        <h4 class="h4">Description</h4>
                        <p class="prose-sm">{attrs.description}</p>
                    </div>
                {/if}
                {#if validators.length}
                    <div class="flex flex-col gap-1">
                        <h4 class="h4 mb-1">Requirements</h4>
                        {#each Object.values(validators) as validator}
                            {@render badge({badge: validator.badge, message: validator.message, isValid: formCtx.errors[field][validator.key]})}
                        {/each}
                        {#each Object.entries(responseValidators) as [key, value]}
                            {@render badge({badge: humanizeString(key), message: value, isValid: false})}
                        {/each}
                    </div>
                {/if}
            </div>
        {/snippet}
    </Popover>
{/if}
