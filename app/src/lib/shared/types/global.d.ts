/**
 * Extra types for the library
 */

declare global {

    /**
     * Useful for forms and region validation
     */
    interface Region {
        readonly name: string
        readonly code: string
        readonly keywords: string[]
        readonly getCountry: () => Country
    }

    /**
     * Useful for forms and country validation
     */
    interface Country {
        readonly name: string
        readonly code: string
        readonly dialCode: string
        readonly keywords: string[]
        readonly regionTitle?: string
        readonly postalCodeTitle?: string
        readonly getRegions: () => Map<string, Region>
    }

}
