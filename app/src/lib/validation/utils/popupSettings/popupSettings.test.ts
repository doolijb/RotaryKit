import { expect, test, vi } from "vitest"
import type { PopupSettings } from "@skeletonlabs/skeleton"
import popupSettings from "."

// test("popupSettings returns PopupSetting for browser", async () => {
//     // Create a mock browser environment
    
//     // Mock the browser environment
//     vi.stubEnv("browser", "true")

//     const expected: PopupSettings = {
//         event: "hover",
//         placement: "bottom",
//         target: expect.any(String) as string,
//     };
//     const result = popupSettings();
//     expect(result).toEqual(expected)

//     vi.unstubAllEnvs()
// })

test("popupSettings returns null for server", async () => {
    const result = popupSettings();
    expect(result).toEqual(null)
})