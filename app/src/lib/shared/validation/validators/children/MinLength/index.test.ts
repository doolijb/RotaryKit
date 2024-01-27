// import { expect, test } from "vitest"
// import minLength from "."

// const data = {
// 	a: "",
// 	b: "test",
// }

// test("minLength validator test: passes", async () => {
// 	const validator = minLength({ minLen: 4 })
// 	expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
// 	expect(await validator.test({key:"b", data})).toBe(true)
// })

// test("minLength validator test: fails", async () => {
// 	const validator = minLength({ minLen: 5 })
// 	expect(await validator.test({key:"a", data})).toBe(false)
// })