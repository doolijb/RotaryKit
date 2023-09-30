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
        passphraseConf: {
            confirmMatch: {
                validator: validators.confirmMatch,
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
        passphraseConf: {
          confirmMatch: {
            validator: validators.confirmMatch,
            args: {
              getMatchValue: () => "password",
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
        passphraseConf: {
            confirmMatch: {
                validator: validators.confirmMatch,
                args: {
                    getMatchValue: () => "password"
                }
            }
        }
    }

    const result = mergeFormValidatorDefinitions({definitions, extras})

    expect(deepCompare(result, expected)).toBe(true)
})