<script lang="ts">
    import {BasicTextInput} from "@components"
	import Icon from "@iconify/svelte"
    import type {IFieldValidator, IFieldErrors} from "@interfaces"

    // Values
    export let label = "Passphrase"
    export let value = ""
    export let placeholder: string | undefined
    export let disabled = false
    export let type = "password"

    // Events
    export let onInput: (e: Event) => void | undefined
    export let onBlur: (e: Event) => void | undefined
    export let onFocus: (e: Event) => void | undefined

    // Refs
    export let ref: HTMLInputElement

    // Validation
    export let fieldValidator: IFieldValidator
    export let fieldErrors: IFieldErrors = {}

    // Visibility
    let showPassword = true // false

    // Methods
    function togglePasswordVisibility() {
        showPassword = !showPassword
        ref.type = showPassword ? "password" : "text"
    }
    
</script>

<BasicTextInput
    bind:label
    bind:type
    bind:fieldValidator
    bind:value
    bind:fieldErrors
    bind:disabled
    bind:ref
    bind:placeholder
    bind:onFocus
    bind:onBlur
    bind:onInput
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span 
        slot="suffix" 
        on:click={togglePasswordVisibility}
        class="text-surface-500 cursor-pointer"
        title="Show Password"
        >
        <Icon
            icon={showPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"}
            width="2em"
            />
    </span>
    
</BasicTextInput>

<style lang="postcss">
</style>
