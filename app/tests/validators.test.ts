import validators from "@validators"
import { expect, test } from "@playwright/test"

test("confirmMatch validator passes", async () => {
	const validator = validators.confirmMatch({ getMatchValue: () => "test" })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("test")).toBe(true)
})

test("confirmMatch validator fails", async () => {
	const validator = validators.confirmMatch({ getMatchValue: () => "test" })
	expect(validator.test("test2")).toBe(false)
})

test("emailAddress validator passes", async () => {
	const validator = validators.emailAddressComplete()
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("john.doe@example.com")).toBe(true)
})

test("emailAddress validator fails", async () => {
	const validator = validators.emailAddressComplete()
	expect(validator.test("john.doe@example")).toBe(false)
})

test("lowercaseRequired validator passes", async () => {
	const validator = validators.lowercaseRequired()
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("test")).toBe(true)
})

test("lowercaseRequired validator fails", async () => {
	const validator = validators.lowercaseRequired()
	expect(validator.test("TEST")).toBe(false)
})

test("maxLength validator passes", async () => {
	const validator = validators.maxLength({ maxLen: 4 })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("test")).toBe(true)
})

test("maxLength validator fails", async () => {
	const validator = validators.maxLength({ maxLen: 3 })
	expect(validator.test("test")).toBe(false)
})

test("minLength validator passes", async () => {
	const validator = validators.minLength({ minLen: 4 })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("test")).toBe(true)
})

test("minLength validator fails", async () => {
	const validator = validators.minLength({ minLen: 5 })
	expect(validator.test("test")).toBe(false)
})

test("numberIncluded validator passes", async () => {
	const validator = validators.numberIncluded({ count: 3})
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("a1b2c3")).toBe(true)
})

test("numberIncluded validator fails", async () => {
	const validator = validators.numberIncluded({ count: 4})
	expect(validator.test("a1b2c3")).toBe(false)
})

test("postalCode validator passes", async () => {
    const validator = validators.postalCodeComplete({ getCountryCode: () => "US" })
    expect(validator.test("")).toBe(true) // Should pass when empty
    expect(validator.test("99208")).toBe(true)
})

test("postalCode validator fails", async () => {
    const validator = validators.postalCodeComplete({ getCountryCode: () => "US" })
    expect(validator.test("9920")).toBe(false)
})

test("required validator passes", async () => {
    const validator = validators.required()
    expect(validator.test("Hello World")).toBe(true)
})

test("required validator fails", async () => {
    const validator = validators.required()
    expect(validator.test("")).toBe(false) // Should fail when empty
})

test("specialCharExcluded validator passes", async () => {
    const validator = validators.specialCharExcluded()
    expect(validator.test("")).toBe(true) // Should pass when empty
    expect(validator.test("HelloWorld")).toBe(true)
})

test("specialCharExcluded validator fails", async () => {
    const validator = validators.specialCharExcluded()
    expect(validator.test("Hello World!")).toBe(false)
})

test("specialCharIncluded validator passes", async () => {
    const validator = validators.specialCharIncluded()
    expect(validator.test("")).toBe(true) // Should pass when empty
    expect(validator.test("Hello World!")).toBe(true)
})

test("specialCharIncluded validator fails", async () => {
    const validator = validators.specialCharIncluded()
    expect(validator.test("Hello World")).toBe(false)
})

test("telephoneComplete validator passes", async () => {
	const validator = validators.telephoneComplete({ getCountryCode: () => "US" })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("5098187327")).toBe(true)
})

test("telephoneComplete validator fails", async () => {
	const validator = validators.telephoneComplete({ getCountryCode: () => "US" })
	expect(validator.test("2223334444")).toBe(false)
})

test("telephonePossible validator passes", async () => {
	const validator = validators.telephonePossible({ getCountryCode: () => "US" })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("5555555555")).toBe(true)
})

test("telephonePossible validator fails", async () => {
	const validator = validators.telephonePossible({ getCountryCode: () => "US" })
	expect(validator.test("0")).toBe(false)
})

test("uppercaseRequired validator passes", async () => {
    const validator = validators.uppercaseRequired()
    expect(validator.test("")).toBe(true) // Should pass when empty
    expect(validator.test("TEST")).toBe(true)
})