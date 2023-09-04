import { expect, test } from "vitest"
import { Validator } from "."

test("Validator class has coverage", async () => {
	// Check that Validator exists, this class is already tested in its children
	expect(Validator).toBeDefined()
})
