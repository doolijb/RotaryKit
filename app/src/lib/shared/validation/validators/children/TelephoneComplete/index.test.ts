// import { expect, test } from "vitest"
// import telephoneComplete from "."

// const data = {
// 	a: "",
// 	b: "5098187327",
// 	c: "2223334444",
// }

// test("telephoneComplete validator test: passes", async () => {
// 	const validator = telephoneComplete({ getCountryCode: () => "US" })
// 	expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
// 	expect(await validator.test({key:"a", data})).toBe(true)
// })

// test("telephoneComplete validator test: fails", async () => {
// 	const validator = telephoneComplete({ getCountryCode: () => "US" })
// 	expect(await validator.test({key:"a", data})).toBe(false)
// })