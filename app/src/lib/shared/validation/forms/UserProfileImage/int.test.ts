import { expect, test } from "vitest"
import { UserProfileImage } from "."

const form = UserProfileImage.init()

test("UserProfileImage form test: passes", async () => {
    const data: FormDataOf<UserProfileImage> = {
        image: [
            new File([""], "test.png", { type: "image/png", size: 10 * 1024 * 1024 }) // 10MB file
        ],
    }
    const result = await form.validate({ data })
    expect(result).toEqual({})
})

test("UserProfileImage form test: fails when file type is invalid", async () => {
    const data = {
        image: [
            new File([""], "test.txt", { type: "text/plain", size: 10 * 1024 * 1024 }) // Invalid file type
        ],
    }
    const result = await form.validate({ data })
    expect(result).toHaveProperty("image")
})

test("UserProfileImage form test: fails when file size exceeds limit", async () => {
    const image = new File([""], "test.png", { type: "image/png" })
    Object.defineProperty(image, "size", { value: 20 * 1024 * 1024 })

    const data = {
        image: [image]
    }
    const result = await form.validate({ data })
    expect(result).toHaveProperty("image")
})

test("UserProfileImage form test: fails when file count exceeds limit", async () => {
    const data = {
        image: [
            new File([""], "test1.png", { type: "image/png" }),
            new File([""], "test2.png", { type: "image/png" }) // Exceeds max file count of 1
        ],
    }
    const result = await form.validate({ data })
    expect(result).toHaveProperty("image")
})