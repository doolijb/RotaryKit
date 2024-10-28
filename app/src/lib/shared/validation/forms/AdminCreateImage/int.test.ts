import { expect, test } from "vitest"
import { AdminCreateImage } from "."
import { ImageStatus, ImageSizes } from "$shared/constants"

const form = AdminCreateImage.init()

test("AdminCreateImage form test: passes", async () => {
    const data: FormDataOf<AdminCreateImage> = {
        title: "Sample Image",
        image: [
            new File([""], "test.png", { type: "image/png" }) // 10MB file
        ],
        maxSize: ImageSizes.LARGE,
        status: ImageStatus.PUBLISHED,
    }
    const result = await form.validate({ data })
    expect(result).toEqual({})
})

test("AdminCreateImage form test: fails when title exceeds max length", async () => {
    const data = {
        title: "A".repeat(256), // Title exceeds max length of 255
        image: [
            new File([""], "test.png", { type: "image/png" })
        ],
        maxSize: ImageSizes.LARGE,
        status: ImageStatus.PUBLISHED,
    }
    const result = await form.validate({ data })
    expect(result).toHaveProperty("title")
})

test("AdminCreateImage form test: fails when file type is invalid", async () => {
    const data = {
        title: "Sample Image",
        image: [
            new File([""], "test.txt", { type: "text/plain" }) // Invalid file type
        ],
        maxSize: ImageSizes.LARGE,
        status: ImageStatus.PUBLISHED,
    }
    const result = await form.validate({ data })
    expect(result).toHaveProperty("image")
})

test("AdminCreateImage form test: fails when file size exceeds limit", async () => {
    const image = new File([""], "test1.png", { type: "image/png"})
    Object.defineProperty(image, "size", { value: 100 * 1024 * 1024 })

    const data = {
        title: "Sample Image",
        image: [image],
        maxSize: ImageSizes.LARGE,
        status: ImageStatus.PUBLISHED,
    }
    const result = await form.validate({ data })
    expect(result).toHaveProperty("image")
})

test("AdminCreateImage form test: fails when file count exceeds limit", async () => {

    const image1 = new File([""], "test1.png", { type: "image/png"})
    const image2 = new File([""], "test2.png", { type: "image/png"})

    const data = {
        title: "Sample Image",
        image: [image1, image2],
        maxSize: ImageSizes.LARGE,
        status: ImageStatus.PUBLISHED,
    }
    const result = await form.validate({ data })
    expect(result).toHaveProperty("image")
})

test("AdminCreateImage form test: fails when status is invalid", async () => {
    const data = {
        title: "Sample Image",
        image: [
            new File([""], "test.png", { type: "image/png" })
        ],
        maxSize: ImageSizes.LARGE,
        status: "invalid_status", // Invalid status not in ImageStatus.options
    }
    const result = await form.validate({ data })
    expect(result).toHaveProperty("status")
})

test("AdminCreateImage form test: fails when maxSize is invalid", async () => {
    const data = {
        title: "Sample Image",
        image: [
            new File([""], "test.png", { type: "image/png" })
        ],
        maxSize: "invalid_size", // Invalid size not in ImageSizes.options
        status: ImageStatus.PUBLISHED,
    }
    const result = await form.validate({ data })
    expect(result).toHaveProperty("maxSize")
})