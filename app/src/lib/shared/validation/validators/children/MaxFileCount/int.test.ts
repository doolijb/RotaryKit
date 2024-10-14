import { expect, test } from "vitest"
import { MaxFileCount } from "."

const file1 = new File(["content"], "file1.pdf", { type: "application/pdf" });
const file2 = new File(["content"], "file2.jpg", { type: "image/jpeg" });
const file3 = new File(["content"], "file3.txt", { type: "text/plain" });

const data = {
    a: [],
    b: [file1, file2],
    c: [file1, file2, file3],
    d: "not a file array",
}

test("max file count validator test: passes", async () => {
    const validator = MaxFileCount.init({ maxCount: 3, typeMaxCount: { document: 2, image: 1 } })

    let result = await validator.test({ key: "a", data })
    expect(result).toBe(true)

    result = await validator.test({ key: "b", data })
    expect(result).toBe(true)
})

test("max file count validator test: fails", async () => {
    const validator = MaxFileCount.init({ maxCount: 2, typeMaxCount: { document: 1, image: 1 } })

    let result = await validator.test({ key: "c", data })
    expect(result).toBe(false)

    result = await validator.test({ key: "d", data })
    expect(result).toBe(false)
})