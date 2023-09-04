import { expect, test } from "vitest"
import { FileTypes } from "."

const file1 = new File(["content"], "file1.pdf", { type: "application/pdf" })
Object.defineProperty(file1, "size", { value: 2 * 1024 * 1024 }) // 2 MB

const file2 = new File(["content"], "file2.jpg", { type: "image/jpeg" })
Object.defineProperty(file2, "size", { value: 4 * 1024 * 1024 }) // 4 MB

const file3 = new File(["content"], "file3.txt", { type: "text/plain" })
Object.defineProperty(file3, "size", { value: 1.5 * 1024 * 1024 }) // 1.5 MB

const file4 = new File(["content"], "file4.doc", { type: "image/png" })
Object.defineProperty(file4, "size", { value: 1.5 * 1024 * 1024 }) // 1.5 MB

const data = {
	a: [],
	b: [file1, file2],
	c: [file3],
	d: "not a file array",
	e: [file2, file4]
}

test("file types validator test: passes with extensions args", async () => {
	const validator = FileTypes.init({ extensions: ["pdf", "jpg"] })

	let result = await validator.test({ key: "a", data })
	expect(result).toBe(true)

	result = await validator.test({ key: "b", data })
	expect(result).toBe(true)
})

test("file types validator test: fails with extensions args", async () => {
	const validator = FileTypes.init({ extensions: ["pdf", "jpg"] })

	let result = await validator.test({ key: "c", data })
	expect(result).toBe(false)

	result = await validator.test({ key: "d", data })
	expect(result).toBe(false)
})

test("file types validator test: passes with fileTypes args", async () => {
	const validator = FileTypes.init({ fileTypes: ["document", "image"] })

	let result = await validator.test({ key: "a", data })
	expect(result).toBe(true)

	result = await validator.test({ key: "b", data })
	expect(result).toBe(true)
})

test("file types validator test: fails with fileTypes args", async () => {
	const validator = FileTypes.init({ fileTypes: ["document"] })

	let result = await validator.test({ key: "c", data })
	expect(result).toBe(true)

	result = await validator.test({ key: "b", data })
	expect(result).toBe(false)

	result = await validator.test({ key: "d", data })
	expect(result).toBe(false)
})

test("file types validator test: passes with both fileTypes and extensions args", async () => {
	const validator = FileTypes.init({ fileTypes: ["document", "image"], extensions: ["jpg", "pdf"] })

	let result = await validator.test({ key: "a", data })
	expect(result).toBe(true)

	result = await validator.test({ key: "b", data })
	expect(result).toBe(true)
})

test("file types validator test: fails with both fileTypes and extensions args", async () => {
	const validator = FileTypes.init({ fileTypes: ["image"], extensions: ["jpg"] })

	let result = await validator.test({ key: "b", data })
	expect(result).toBe(false)

	// Should fail, because while png is an image, extensions is defined and png is not in the list
	result = await validator.test({ key: "e", data })
	expect(result).toBe(false)
})
