import { expect, test } from "vitest"
import definition from "."
import { utils } from "@validation"

test("username field validation passes", async () => {
    const field = utils.fieldValidator({definition})
    const input = "SparrowJack"
    const errors = await field.test(input)
    expect(Object.keys(errors)).toHaveLength(0)
})

test("username field validation fails", async () => {
    const field = utils.fieldValidator({definition})
    const input = "$parrowJack"
    const errors = await field.test(input)
    expect(Object.keys(errors)).toHaveLength(1)
})