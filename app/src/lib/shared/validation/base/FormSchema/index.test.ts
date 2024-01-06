import { expect, test } from "vitest"
import { FormSchema } from "."
import { validators as v } from "$validation"

class TestForm extends FormSchema {
    fields = {
        someString: new v.String().minLength(3).maxLength(10),
        // someNumber: new v.Number(),
        someBoolean: new v.Boolean(),
        someArray: new v.Array(),
        optionalString: new v.String(),
    }
    optional = {
        optionalString: true,
    }
}

test("FormSchema: passes", async () => {
    const form = new TestForm()

    const data = {
        someString: "test",
        someBoolean: true,
        someArray: [],
        optionalString: "test",
    }

    const errors = await form.validate({data})

    const expected = {}
    expect(errors).toEqual(expected)
})