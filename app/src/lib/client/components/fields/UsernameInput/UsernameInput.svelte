<script lang="ts">
    import {BasicTextInput} from "@components"
    import { validators as v } from "@validation"
    import type {IValidator} from "@interfaces"    /** If the field is disabled */
    export let disabled = false
    /** List of validators with errors */
    export let errors: IValidator[] = []    /** Name of the field */
    export let label = "Username"    /** Additional events on:Blur */
    export let onBlur: (e: Event) => void | undefined    /** Additional events on:Focus */
    export let onFocus: (e: Event) => void | undefined    /** Additional events on:Input */
    export let onInput: (e: Event) => void | undefined    

    /** Ref to the input element */
    export let ref: HTMLInputElement    /** Type of the input */
    export let type = "text"    /** List of validators to test the field */
    export let validators: IValidator[] = [
        v.required(),
        v.minLength({minLen: 3}),
        v.maxLength({maxLen: 20}),
        v.specialCharExcluded()
    ]
    /** Value of the field */
    export let value = ""    /**
     * Reactivity
    */
    $: value = value.toLocaleLowerCase().trim()
</script><BasicTextInput
    bind:label
    bind:type
    bind:validators
    bind:value
    bind:errors
    bind:disabled
    bind:onFocus
    bind:onBlur
    bind:onInput
    bind:ref
/><style lang="postcss">
</style>
