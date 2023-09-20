import type { PopupSettings } from "@skeletonlabs/skeleton"

export * from "./models"

export interface ICountry {
    readonly name: string
    readonly code: string
    readonly dialCode: string
    readonly keywords: string[]
    readonly regionTitle?: string
    readonly postalCodeTitle?: string
    readonly getRegions: () => Map<string, IRegion>
}

/**
 * Validator for a single field
 */
export interface IFieldValidator {
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
 * Output of makeFieldValidatorSet
 */
export interface IFieldValidatorSet {
    [key: string]: IFieldValidator
}

/**
 * Output of makeFormValidatorSet
 */
export interface IFormValidatorSet {
    [key: string]: IFieldValidatorSet
}

/**
 * Definition for a field validator
 */
export interface IFieldValidatorSetDefs {
    [key: string]: {
        args?: Record<string, any>
        validator?: (args: Record<string, any>) => IFieldValidator
    }
}

/**
 * Default definition for field validatiors
 */
export interface IFieldValidatorSetDefaultArgs {
    [key: string]: {
        args?: { [key: string]: any }
        validator: (args: any) => IFieldValidator
    }
}

/**
 * Arguments for form validators
 */
export interface IFormValidatorSetArgs {
    [key: string]: {
        field: (args: IFieldValidatorSetDef) => IFieldValidatorSet,
        args: IFieldValidatorSetDef
    },
}

export interface IRegion {
    readonly name: string
    readonly code: string
    readonly keywords: string[]
    readonly getCountry: () => ICountry
}
