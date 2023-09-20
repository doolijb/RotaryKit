<script lang="ts">
    import {BaseTextInput} from "@components"
    import { validators as v } from "@validation"
    import type {IFieldValidator} from "@interfaces"

    export let disabled = false
    export let errors: IFieldValidator[] = []
    export let label = "Password"
    // Component specific
    export let matchValue = ""

    export let onBlur: (e: Event) => void | undefined

    export let onFocus: (e: Event) => void | undefined

    export let onInput: (e: Event) => void | undefined

    export let ref: HTMLInputElement

    export let type = "password"

    export let validators: IFieldValidator[] = [
        v.required(),
        v.confirmMatch({label: "Password", getMatchValue})
    ]


    export let value = ""
    function getMatchValue(): string {
        return matchValue
    } // TODO
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
    bind:ref
/>

<style lang="postcss">
</style>
