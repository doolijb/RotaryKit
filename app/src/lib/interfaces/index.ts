export * from "./models"
export * from "./validation"

/**
 * Useful for forms and region validation
 */
export interface IRegion {
    readonly name: string
    readonly code: string
    readonly keywords: string[]
    readonly getCountry: () => ICountry
}

/**
 * Useful for forms and country validation
 */
export interface ICountry {
    readonly name: string
    readonly code: string
    readonly dialCode: string
    readonly keywords: string[]
    readonly regionTitle?: string
    readonly postalCodeTitle?: string
    readonly getRegions: () => Map<string, IRegion>
}
