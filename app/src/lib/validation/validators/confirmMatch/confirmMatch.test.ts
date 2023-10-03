import { expect, test } from "vitest"
import confirmMatch from "."

test("confirmMatch validator test passes", async () => {
	const validator = confirmMatch({ getMatchValue: () => "test" });
	expect( await validator.test("test")).toBe(true)
})

test("confirmMatch validator test fails", async () => {
	const validator = confirmMatch({ getMatchValue: () => "test" })
	expect( await validator.test("test2")).toBe(false)
})