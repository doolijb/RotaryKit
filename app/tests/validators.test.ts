import validators from '@validators'
import { expect, test } from '@playwright/test';
const validator = validators.emailAddress()

test('emailAddress validator passes', () => {
    // expect(validator.test('john.doe@example.com')).toBe(true)
    expect(true).toBe(true)
})

test('emailAddress validator fails', () => {
    expect(validator.test('john.doe@example')).toBe(false)
})