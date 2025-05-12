<script lang="ts">
    import { FieldBase } from "$client/components"
    import { Combobox } from "@skeletonlabs/skeleton-svelte"
    import { type ComponentProps } from "svelte"
	import { validators as v } from "$shared/validation"
	import * as Icon from "lucide-svelte"

    ////
    // LOCAL EXPORTS
    ////

    interface Props extends Omit<ComponentProps<typeof FieldBase>, "children"> {
        // Props
        options?: ComboboxData[]
		allowCustomValue?: boolean
    }

	type ComboboxData = {
		label: string
		value: string
	}

    let {
        // Props
        options,
		allowCustomValue = false,

        // Bindables
        ref = $bindable(undefined),

        ...restProps
    }: Props = $props();

    ////
    // CONSTANTS
    ////

    const formCtx = restProps.form.getContext();

	////
	// VARIABLES
	////

	let inputValue: string = $state()

    ////
    // CALCULATED
    ////

    let fieldValidator = $derived(restProps.form.fields[restProps.field]);
    let selectOptionsValidator = $derived(fieldValidator.validators.find((v) => v.key == "selectOptions"));

    // Combobox data
    let comboboxData: ComboboxData[] = $state(options || []);
	let comboboxValue: string[] = $derived(formCtx.data[restProps.field] instanceof Array ? formCtx.data[restProps.field] as string[] : formCtx.data[restProps.field] ? [formCtx.data[restProps.field] as string] : [])

    $effect(() => { 
		if (!comboboxData.length && selectOptionsValidator) {
			comboboxData = selectOptionsValidator.args["options"].map((option: string) => ({
				label: option,
				value: option,
			}));
		}
	})

	const multiple = restProps.form.fields[restProps.field] instanceof v.Array

	function onValueChange (value: string[]) {
		if (multiple) {
			formCtx.data[restProps.field] = value
		} else {
			if (value.length) {
				formCtx.data[restProps.field] = value[0]
			} else {
				formCtx.data[restProps.field] = ""
			}
		}
	}

	$effect(() => {
		if (!multiple && comboboxValue.length) {
			const option = options.find((option) => option.value === comboboxValue[0])
			inputValue = option ? option.label : ""
		} else if (multiple) {
			inputValue = ""
		}
	})

</script>

<FieldBase bind:ref {...restProps}>
    {#snippet children({
        id,
        attrs,
        field,
        disabled,
        onblur,
    })}
        <Combobox
            data={comboboxData}
            value={comboboxValue}
            onValueChange={(e) => onValueChange(e.value)}
            placeholder={attrs.placeholder || multiple ? "Select multiple..." : "Select..."}
			inputGroupClasses="bg-surface-200-800"
            {disabled}
			{multiple}
			{allowCustomValue}
			{inputValue}
        >
            <!-- Custom rendering for items -->
            {#snippet item(item)}
                <div class="flex w-full justify-between space-x-2">
                    <span>{item.label}</span>
                </div>
            {/snippet}
        </Combobox>
		{#if multiple && (formCtx.data[field] as string[]).length}
			<div class="flex flex-col gap-1 mt-1" class:opacity-75={disabled}>
				{#each (formCtx.data[field] as string[]) as item}
					<div class="flex items-center justify-between preset-tonal p-2 rounded-sm">
						<span class="select-none">{options.find((o) => o.value === item).label}</span>
						{#if !disabled}
							<button title="Remove" type="button" onclick={() => (formCtx.data[field] = (formCtx.data[field] as string[]).filter((i) => i !== item))}>
								<Icon.X class="text-red-500" />
							</button>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
    {/snippet}
</FieldBase>

Data: {JSON.stringify(formCtx.data)}