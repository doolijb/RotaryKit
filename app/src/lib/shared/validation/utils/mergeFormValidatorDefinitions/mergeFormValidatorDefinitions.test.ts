import { expect, test } from "vitest"
import mergeFormValidatorDefinitions from "."
import { validators } from "@validation"
import { deepCompare } from "@testing"

test("mergeFormValidatorDefinitions has correct output", async () => {
    const definitions = {
        passphrase: {
            required: {
                validator: validators.required,
                args: {}
            },
            minLength: {
                validator: validators.minLength,
                args: {
                    length: 5
                }
            }
        },
        passphraseConfirm: {
            matches: {
                validator: validators.matches,
            }
        }
    }

    const extras = {
        email: {
          required: {
            validator: validators.required,
            args: {},
          },
          emailAddressComplete: {
            validator: validators.emailAddressComplete,
            args: {},
          },
        },
        passphraseConfirm: {
          matches: {
            validator: validators.matches,
            args: {
              getValue: () => "password",
            },
          },
        },
      }
    
    const expected = {
        email: {
            required: {
                validator: validators.required,
                args: {}
            },
            emailAddressComplete: {
                validator: validators.emailAddressComplete,
                args: {}
            }
        },
        passphrase: {
            required: {
                validator: validators.required,
                args: {}
            },
            minLength: {
                validator: validators.minLength,
                args: {
                    length: 5
                }
            },
        },
        passphraseConfirm: {
            matches: {
                validator: validators.matches,
                args: {
                    getValue: () => "password"
                }
            }
        }
    }

    const result = mergeFormValidatorDefinitions({definitions, extras})

    expect(deepCompare(result, expected)).toBe(true)
})