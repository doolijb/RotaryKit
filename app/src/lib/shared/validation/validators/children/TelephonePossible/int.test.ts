// import { expect, test } from "vitest"
// import telephonePossible from "."

// const data = {
// 	a: "",
// 	b: "5555555555",
// 	c: "0",
// }

// test("telephonePossible validator test: passes", async () => {
// 	const validator = telephonePossible({ getCountryCode: () => "US" })
// 	expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
// 	expect(await validator.test({key:"b", data})).toBe(true)
// })

// test("telephonePossible validator test: fails", async () => {
// 	const validator = telephonePossible({ getCountryCode: () => "US" })
// 	expect(await validator.test({key:"c", data})).toBe(false)
// })