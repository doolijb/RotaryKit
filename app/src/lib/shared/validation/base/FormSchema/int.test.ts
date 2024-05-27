// import { expect, test } from "vitest"
// import { FormSchema } from "."
// import { validators as v } from "$shared/validation"

// class TestForm extends FormSchema {
//     fields = {
//         someString: v.String.init().minLength(3).maxLength(10),
//         // someNumber: v.Number.init(),
//         someBoolean: v.Boolean.init(),
//         someArray: v.Array.init(),
//         optionalString: new v.String(),
//     }
//     optional = {
//         optionalString: true,
//     }
// }

// test("FormSchema: passes", async () => {
//     const form = TestForm.init()

//     const data = {
//         someString: "test",
//         someBoolean: true,
//         someArray: [],
//         optionalString: "test",
//     }

//     const errors = await form.validate({data})

//     const expected = {}
//     expect(errors).toEqual(expected)
// })