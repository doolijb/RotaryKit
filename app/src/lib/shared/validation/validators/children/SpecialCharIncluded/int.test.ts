// import { expect, test } from "vitest"
// import specialCharIncluded from "."

// const data = {
//     a: "",
//     b: "Hello World!",
//     c: "Hello World",
// }

// test("specialCharIncluded validator test: passes", async () => {
//     const validator = specialCharIncluded()
//     expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
//     expect(await validator.test({key:"b", data})).toBe(true)
// })

// test("specialCharIncluded validator test: fails", async () => {
//     const validator = specialCharIncluded()
//     expect(await validator.test({key:"c", data})).toBe(false)
// })