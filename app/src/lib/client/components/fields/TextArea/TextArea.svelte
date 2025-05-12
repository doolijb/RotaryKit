<script lang="ts">
    import {FieldBase, ValidationBadges, ValidationLegend} from "$client/components"
    import {ValidStates} from "$shared/constants"
    import {createEventDispatcher, onMount, type ComponentProps, type Snippet} from "svelte"
    import type {PopupSettings} from "@skeletonlabs/skeleton-svelte"
    import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"

    const dispatch = createEventDispatcher()

    ////
    // LOCAL EXPORTS
    

    interface Props extends Omit<ComponentProps<typeof FieldBase>, "children"> {
        rows?: number
        controls?: Snippet
        extraControls?: Snippet
        showLegend?: boolean
    }

    let {
        rows = 3,
        ref = $bindable(undefined),
        controls,
        extraControls,
        showLegend = true,
        ...restProps
    }: Props = $props()

    ////
	// CONSTANTS
	////

	const formCtx = restProps.form.getContext()

</script>


<FieldBase bind:ref {...restProps}>
    {#snippet children({
		validState, 
		id, 
		attrs, 
		field, 
		disabled, 
		onfocus,
		oninput,
		onblur,
		validatorLength,
		fieldValidator,
		form,
		required,
		})}
        {@const showControls = controls || extraControls || !disabled && (showLegend && (validatorLength || attrs?.description))}
        <div 
            class="textarea w-full flex flex-col mb-4 p-0 overflow-hidden pt-1 bg-surface-200-800"
            >
            <textarea
                id={id}
                class="resize-none px-2 m-0 focus:border-0 focus:ring-0 bg-transparent flex-grow focus:outline-none"
                class:!border-b-1={showControls}
                class:!border-surface-200-800={showControls}
                bind:this={ref}
                value={formCtx.data[field] !== "" ? formCtx.data[field] as string : undefined}
                oninput={(e)  => {
                    // Need to explicitly assign the value so we can display the placeholder if the field is empty
                    formCtx.data[field] = (e.target as HTMLTextAreaElement).value
                    oninput?.(e)
                }}
                {disabled}
                {required}
                {rows}
                placeholder={attrs.placeholder}
                {onfocus}
                {onblur}
            ></textarea>
            {#if showControls}
                <div class="fieldFooter flex items-center justify-between px-3 py-2">
                    <div class="inline-flex items-center">
                        {@render controls?.()}
                    </div>
                    <div class="flex w-100 ps-0 space-x-1 rtl:space-x-reverse sm:ps-2 place-content-end">
                        {@render extraControls?.()}
                        {#if (!disabled && validatorLength || attrs?.description) && showLegend}
                            <ValidationLegend {fieldValidator} {form} {field} {attrs} />
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    {/snippet}
</FieldBase>
