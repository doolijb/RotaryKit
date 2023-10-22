// See https://kit.svelte.dev/docs/types#app

import type { Request } from "express"

// for information about these types
declare global {
	namespace App {
		interface Error {
			message?: string
			errors?: FormErrors
		}
		interface Locals {
            user?: User,
            userAgent?: {[key:string]: any} | null,
            userTokenId?: string,
            data?: Record<string, any>
        }
		interface PageData {
            title?: string
            description?: string
            keywords?: string
            user?: User
        }
		// interface Platform {}
	}

	  /**
	   * This type is missing from the typescript definitions for the
	   * `@sveltejs/kit` package.
	   */
	  interface Resolve {
		(event: RequestEvent): MaybePromise<Response>
	  }

	  interface FieldValidatorDefinition {
			[key: string]: {
				validator?: (args: Record<string, any>) => IValidator
				args?: Record<string, any>
			}
		}

	  /**
     * Validator for a single field
     */
	  interface Validator {
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
	interface FieldValidatorDefinition {
		[key: string]: {
			validator?: (args: Record<string, any>) => Validator
			args?: Record<string, any>
		}
	}

    /**
     * Output of fieldValidator
     */
    interface FieldValidator {
        validators: {
            [key: string]: Validator
        }
        test: (value: any) => Promise<FieldErrors>
    }

    /**
     * Field validation errors
     */
    interface FieldErrors {
        [key: string]: string
    }

    /**
     * Definition for an unstubstiated form validator
     */
    interface FormValidatorDefinition {
        [key: string]: FieldValidatorDefinition
    }

    /**
     * Ouytput of fieldValidator
     */
    interface FormValidator {
        fields: {
            [key: string]: FieldValidator
        }
        test: (values: Record<string, any>) => Promise<FormErrors>
    }

    /**
     * Form validation errors
     */
    interface FormErrors {
        [key: string]: FieldErrors
    }
}

export {};
