// import { expect, test } from "vitest"
// import definition from "."
// import { utils } from "$shared/validation"

// test("email field validation: passes", async () => {
//     const field = utils.fieldValidator({definition})
//     const input = "jack.sparrow@example.com"
//     const errors = await field.test(input)
//     expect(Object.keys(errors)).toHaveLength(0)
// })

// test("Email fField validation: fails", async () => {
//     const field = utils.fieldValidator({definition})
//     const input = "jack.sparrow@example"
//     const errors = await field.test(input)
//     expect(Object.keys(errors)).toHaveLength(1)
// })