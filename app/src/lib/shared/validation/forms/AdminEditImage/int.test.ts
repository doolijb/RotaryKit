import { expect, test } from "vitest"
import { AdminEditImage } from "."
import { ImageStatus } from "$shared/constants"

const form = AdminEditImage.init()

test("AdminEditImage form test: passes", async () => {
	const data: FormDataOf<AdminEditImage> = {
		title: "Sample Image",
		status: ImageStatus.PUBLISHED
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AdminEditImage form test: fails when title exceeds max length", async () => {
	const data = {
		title: "A".repeat(256), // Title exceeds max length of 255
		status: ImageStatus.UNPUBLISHED
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("title")
})

test("AdminEditImage form test: fails when status is invalid", async () => {
	const data = {
		title: "Sample Image",
		status: "invalid_status" // Invalid status not in ImageStatus.options
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("status")
})
