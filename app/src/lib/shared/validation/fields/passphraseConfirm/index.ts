import { validators as v } from "$validation"

export const passphraseConfirm  = () => v.String.init().matches({matchingLabel:"Passphrase", matchingField: "passphrase"})