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
 * Output of makeFieldValidator
 */
export interface IFieldValidator {
    validators: {
        [key: string]: IValidator
    }
    test: (value: any) => Promise<string[]>
}

/**
 * Output of makeFormValidator
 */
export interface IFormValidator {
    fields: {
        [key: string]: IFieldValidator
    }
    test: ( data: Record<string, any> ) => Promise<Record<string, string[]>>
}