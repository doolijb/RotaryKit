import { expect, test } from "vitest"
import confirmMatch from "."

test("confirmMatch validator passes", async () => {
	const validator = confirmMatch({ getMatchValue: () => "test" });
	expect( await validator.test("test")).toBe(true)
})

test("confirmMatch validator fails", async () => {
	const validator = confirmMatch({ getMatchValue: () => "test" })
	expect( await validator.test("test2")).toBe(false)
})