import { expect, test } from "vitest"
import { Files } from "."

const file1 = new File(["content"], "file1.txt", { type: "text/plain" });
const file2 = new File(["content"], "file2.txt", { type: "text/plain" });

const data = {
    a: [],
    b: [file1, file2],
    c: "not a file array",
}

test("FileUpload primitive validator test: passes", async () => {
    const validator = Files.init()

    let result = await validator.validate({ key: "a", data })
    expect(Object.keys(result)).toHaveLength(0)

    result = await validator.validate({ key: "b", data })
    expect(Object.keys(result)).toHaveLength(0)
})

test("FileUpload primitive validator test: fails", async () => {
    const validator = Files.init()

    const result = await validator.validate({ key: "c", data })

    expect(Object.keys(result)).toHaveLength(1)
})