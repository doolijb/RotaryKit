import { expect, test } from "vitest"
import passphrase from "."

test("passphrase field validation passes", async () => {
    const field = passphrase.field()
    const input = "$some 5tr0ng p4ssphr4se!"
    const errors = await field.test(input)
    expect(errors).toHaveLength(0)
})

test("passphrase field validation fails", async () => {
    const field = passphrase.field()
    const input = "password"
    const errors = await field.test(input)
    expect(errors).toHaveLength(1)
})