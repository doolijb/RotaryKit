<script lang="ts">
    import {BaseTextInput} from "@components"
    import { validators as v } from "@validation"
    import type {IFieldValidator} from "@interfaces"

    export let disabled = false
    export let errors: IFieldValidator[] = []
    export let label = "Password"
    export let onBlur: (e: Event) => void | undefined
    export let onFocus: (e: Event) => void | undefined
    export let onInput: (e: Event) => void | undefined
    export let type = "password"
    export let validators: IFieldValidator[] = [
        v.required(),
        v.minLength({minLen: 10}),
        v.maxLength({maxLen: 100}),
        v.lowercaseRequired(),
        v.uppercaseRequired(),
        v.numberIncluded(),
        v.specialCharIncluded()
    ]
    export let value = ""
</script>

<BaseTextInput
    bind:label
    bind:type
    bind:validators
    bind:value
    bind:errors
    bind:disabled
    bind:onFocus
    bind:onBlur
    bind:onInput
/>

<style lang="postcss">
</style>
