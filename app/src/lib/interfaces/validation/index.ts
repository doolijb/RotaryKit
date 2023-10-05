import type { PopupSettings } from "@skeletonlabs/skeleton"

/**
 * Validator for a single field
 */
export interface IValidator {
    args: object
    key: string
    badge: string
    sticky: boolean
    message: string
    popup: PopupSettings
    //Async
    test: (value: any) => Promise<boolean>
}

/**
 * Definition for an unstubstiated field validator
 */
export interface IFieldValidatorDefinition {
    [key: string]: {
        validator?: (args: Record<string, any>) => IValidator
        args?: Record<string, any>
    }
}

/**
 * Definition for an unstubstiated form validator
 */
export interface IFormValidatorDefinition {
    [key: string]: IFieldValidatorDefinition,
}

/**
 * Output of fieldValidator
 */
export interface IFieldValidator {
    validators: {
        [key: string]: IValidator
    }
    test: (value: any) => Promise<IFieldErrors>
}

/**
 * Output of formValidator
 */
export interface IFormValidator {
    fields: {
        [key: string]: IFieldValidator
    }
    test: ( data: Record<string, any> ) => Promise<Record<string, Record<string, string>>>
}

/**
 * Field validation errors
 */
export interface IFieldErrors {
    [key: string]: string[]
}

/**
 * Form validation errors
 */

export interface IFormErrors {
    [key: string]: IFieldErrors
}