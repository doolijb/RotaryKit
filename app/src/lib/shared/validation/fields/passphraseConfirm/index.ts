import { validators as v } from "$validation"

export const passphraseConfirm  = () => new v.String().matches({matchingLabel:"Passphrase", matchingField: "passphrase"})