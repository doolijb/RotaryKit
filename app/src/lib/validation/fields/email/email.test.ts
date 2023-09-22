import { expect, test } from "vitest"
import email from "."

test("email field validation passes", async () => {
    const field = email.field()
    const input = "jack.sparrow@example.com"
    const errors = await field.test(input)
    expect(errors).toHaveLength(0)
})

test("email field validation fails", async () => {
    const field = email.field()
    const input = "jack.sparrow@example"
    const errors = await field.test(input)
    expect(errors).toHaveLength(1)
})