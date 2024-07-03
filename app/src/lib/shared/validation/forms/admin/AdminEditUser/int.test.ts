import { expect, test } from "vitest"
import { AdminEditUser } from "."

const form = AdminEditUser.init()

test("AdminEditUser form test: passes", async () => {
    const data: FormDataOf<AdminEditUser> = {
        username: "testuser",
        isVerified: true,
        isActive: false,
    }
    const result = await form.validate({data})
    expect(result).toEqual({})
})

test("AdminEditUser form test: fails when username is not a valid username", async () => {
    const data = {
        username: "invalid username", // username is not a valid username
        isVerified: true,
        isActive: false,
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("username")
})

test("AdminEditUser form test: fails when isVerified is not a boolean", async () => {
    const data = {
        username: "testuser",
        isVerified: "true", // isVerified is not a boolean
        isActive: false,
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("isVerified")
})

test("AdminEditUser form test: fails when isActive is not a boolean", async () => {
    const data = {
        username: "testuser",
        isVerified: true,
        isActive: "false", // isActive is not a boolean
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("isActive")
}) 