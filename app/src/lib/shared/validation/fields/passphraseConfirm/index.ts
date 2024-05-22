import { validators as v } from "$shared/validation"

export const passphraseConfirm  = () => v.String.init().matches({matchingLabel:"Passphrase", matchingField: "passphrase"})