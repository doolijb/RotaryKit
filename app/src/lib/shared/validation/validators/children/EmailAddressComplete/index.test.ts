// import { expect, test } from "vitest"
// import emailAddressComplete from "."

// const data = {
// 	a: "",
// 	b: "john.doe@example.com",
// 	c: "john.doe@example",
// }

// test("emailAddress validator test: passes", async () => {
// 	const validator = emailAddressComplete()
// 	expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
// 	expect(await validator.test({key:"b", data})).toBe(true)
// })

// test("emailAddress validator test: fails", async () => {
// 	const validator = emailAddressComplete()
// 	expect(await validator.test({key:"c", data})).toBe(false)
// })