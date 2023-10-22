<script lang="ts">
    import {FormBase, BasicTextInput, PassphraseInput} from "@components"
    import {forms, utils} from "$lib/shared/validation"


    export let onSubmit: (e: Event) => Promise<void> | undefined
    export let onCancel: (e: Event) => Promise<void> | undefined = undefined

    export let disabled = false

    export let formData: {[key: string]: any} = {
        username: "",
        passphrase: "",
    }

    export let formErrors: FormErrors = {}

    export let formValidator: FormValidator = utils.formValidator({
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
        label="Username or Email"
        id="username"
        type="username"
        bind:value={formData.username}
        bind:fieldValidator={formValidator.fields.username}
        bind:fieldErrors={formErrors.username}
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