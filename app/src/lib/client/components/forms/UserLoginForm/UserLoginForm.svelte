<script lang="ts">
    import {FormBase, BasicTextInput, PassphraseInput} from "@components"
    import {forms, utils} from "@validation"
    import type {IFormValidator, IFormErrors} from "@interfaces"

    export let onSubmit: (e: Event) => Promise<void> | undefined
    export let onCancel: (e: Event) => Promise<void> | undefined = undefined

    export let disabled = false

    export let formData: {[key: string]: any} = {
        email: "",
        passphrase: "",
    }

    export let formErrors: IFormErrors = {}

    export let formValidator: IFormValidator = utils.formValidator({
        definitions: forms.userLogin,
    })

</script>

<FormBase 
    bind:formValidator 
    bind:formErrors 
    bind:formData 
    bind:onSubmit 
    bind:onCancel>
    <BasicTextInput
        label="Email"
        id="email"
        type="email"
        bind:value={formData.email}
        bind:fieldValidator={formValidator.fields.email}
        bind:fieldErrors={formErrors.email}
        {disabled}
    />
    <PassphraseInput
        label="Passphrase"
        id="passphrase"
        bind:value={formData.passphrase}
        bind:fieldValidator={formValidator.fields.passphrase}
        bind:fieldErrors={formErrors.passphrase}
        {disabled}
    />
</FormBase>