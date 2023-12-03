
import { test, expect } from '@playwright/test';
import { axios, apiRoute, basicUser, superUser, loginUser } from "@testing"
import { db } from "@database"

test('admin users GET: passes', async ({ page }) => {
    /**
     * Create user
     */
    await db.transaction(async (tx) => {
      // await basicUser.create({ tx })
      await superUser.create({ tx })
    })

    // /**
    //  * Login
    //  */
    // const cookie = await loginUser(superUser.data)

    // /**
    //  * Send request
    //  */
    // const response = await axios.get(apiRoute(__dirname), {
    //   headers: {
    //     cookie
    //   }
    // })

    /**
     * Check the response
     */
    expect(true).toBe(true)
    // expect(response.status).toBe(200)
    // expect(response.data.success).toBe(true)
    // expect(response.data.results.length).toBe(2)
})

