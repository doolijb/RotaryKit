import { expect, test } from "vitest"
import { FileSizes } from "."

const file1 = new File(["content"], "file1.pdf", { type: "application/pdf" });
Object.defineProperty(file1, 'size', { value: 2 * 1024 * 1024 }); // 2 MB

const file2 = new File(["content"], "file2.jpg", { type: "image/jpeg" });
Object.defineProperty(file2, 'size', { value: 4 * 1024 * 1024 }); // 4 MB

const file3 = new File(["content"], "file3.txt", { type: "text/plain" });
Object.defineProperty(file3, 'size', { value: 1.5 * 1024 * 1024 }); // 1.5 MB

const data = {
    a: [],
    b: [file1, file2],
    c: [file3],
    d: "not a file array",
}

test("file sizes validator test: passes", async () => {
    const validator = FileSizes.init({ maxSize: 10, typeMaxSizes: { document: 3, image: 5 } })

    let result = await validator.test({ key: "a", data })
    expect(result).toBe(true)

    result = await validator.test({ key: "b", data })
    expect(result).toBe(true)
})

test("file sizes validator test: fails", async () => {
    const validator = FileSizes.init({ maxSize: 1, typeMaxSizes: { document: 1, image: 5 } })

    let result = await validator.test({ key: "c", data })
    expect(result).toBe(false)

    result = await validator.test({ key: "d", data })
    expect(result).toBe(false)
})