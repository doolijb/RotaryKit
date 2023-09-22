import { expect, test } from "vitest"
import username from "."

test("username field validation passes", async () => {
    const field = username.field()
    const input = "SparrowJack"
    const errors = await field.test(input)
    expect(errors).toHaveLength(0)
})

test("username field validation fails", async () => {
    const field = username.field()
    const input = "$parrowJack"
    const errors = await field.test(input)
    expect(errors).toHaveLength(1)
})