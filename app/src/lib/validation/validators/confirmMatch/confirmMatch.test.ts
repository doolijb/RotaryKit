import { expect, test } from "vitest"
import confirmMatch from "."

test("confirmMatch validator passes", async () => {
	const validator = confirmMatch({ getMatchValue: () => "test" })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("test")).toBe(true)
})

test("confirmMatch validator fails", async () => {
	const validator = confirmMatch({ getMatchValue: () => "test" })
	expect(validator.test("test2")).toBe(false)
})