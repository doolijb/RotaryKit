// import { expect, test } from "vitest"
// import lowercaseRequired from "."

// const data = {
// 	a: "",
// 	b: "test",
// 	c: "TEST",
// }

// test("lowercaseRequired validator test: passes", async () => {
// 	const validator = lowercaseRequired()
// 	expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
// 	expect(await validator.test({key:"b", data})).toBe(true)
// })

// test("lowercaseRequired validator test: fails", async () => {
// 	const validator = lowercaseRequired()
// 	expect(await validator.test({key:"c", data})).toBe(false)
// })