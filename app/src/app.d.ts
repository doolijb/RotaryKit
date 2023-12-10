// See https://kit.svelte.dev/docs/types#app

import type { Request } from "express"
import { schema } from "@database"
import type { SelectedFields } from "drizzle-orm/pg-core"

// for information about these types
declare global {
	namespace App {
		interface Error {
			message?: string
			errors?: FormErrors
            status?: number
		}
		interface Locals {
            user?: SelectUser,
            adminPermissions?: SelectAdminPermission[],
            userAgent?: {[key:string]: any} | null,
            userTokenId?: string,
            data?: Record<string, any>
        }
		interface PageData {
            title?: string
            description?: string
            keywords?: string
            user?: SelectUser
        }
		// interface Platform {}
	}


    type ReturningSelect = {[key:string]: AnyPgColumn} | undefined
    type PromisedQueryResult<Returning extends ReturningSelect> = Promise<QueryResult<Returning extends undefined ? never : {[key in keyof Returning]?: any}>>

	  /**
	   * This type is missing from the typescript definitions for the
	   * `@sveltejs/kit` package.
	   */
	  interface Resolve {
		(event: RequestEvent): MaybePromise<Response>
	  }

	  interface FieldValidatorDefinition {
			[key: string]: {
				validator?: (args: Record<string, any>) => Validator
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
        requiredFields: string[]
        test: (values: Record<string, any>) => Promise<FormErrors>
    }

    /**
     * Form validation errors
     */
    interface FormErrors {
        [key: string]: FieldErrors
    }

    /**
     * Database transaction
     */
    type DbTransaction = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>

    /**
     * Select schema types
     */
    type SelectUser = InferSelectModel<typeof schema.users>
    type SelectUserToken = InferSelectModel<typeof schema.userTokens>
    type SelectEmail = InferSelectModel<typeof schema.emails>
    type SelectEmailVerification = InferSelectModel<typeof schema.emailVerifications>
    type SelectPassphrase = InferSelectModel<typeof schema.passphrases>
    type SelectPassphraseReset = InferSelectModel<typeof schema.passphraseResets>
    type SelectAdminPermission = InferSelectModel<typeof schema.adminPermissions>
    type SelectAdminRole = InferSelectModel<typeof schema.adminRoles>
    type SelectAdminRolePermission = InferSelectModel<typeof schema.adminRolePermissions>
    type SelectUserAdminRole = InferSelectModel<typeof schema.useradminRoles>

    /**
     * Insert schema types
     */
    type InsertUser = InferInsertModel<typeof schema.users>
    type InsertUserToken = InferInsertModel<typeof schema.userTokens>
    type InsertEmail = InferInsertModel<typeof schema.emails>
    type InsertEmailVerification = InferInsertModel<typeof schema.emailVerifications>
    type InsertPassphrase = InferInsertModel<typeof schema.passphrases>
    type InsertPassphraseReset = InferInsertModel<typeof schema.passphraseResets>
    type InsertAdminPermission = InferInsertModel<typeof schema.adminPermissions>
    type InsertAdminRole = InferInsertModel<typeof schema.adminRoles>
    type InsertAdminRolePermission = InferInsertModel<typeof schema.adminRolesToPermissions>
    type InsertUserAdminRole = InferInsertModel<typeof schema.usersToAdminRoles>

    type PermissionAction = "GET" | "POST" | "PUT" | "DELETE"

    type Result<T extends InferSelectModel<PgTableWithColumns<any>>> = { 
        [key: string]: string | boolean | number | Date | Result | Result[] 
    }

    type PaginatedResponse<T extends InferSelectModel<PgTableWithColumns<any>>> = {
        success: true,
        results: Result<T>[],
        resultCount: number,
        resultStart: number,
        resultEnd: number,
        totalCount: number,
        pageLimit: number,
        previousPage: number,
        currentPage: number,
        nextPage: number,
        pageCount: number,
        orderBy: string,
        search?: string,
    }
    
    type AvailableRelations<T extends PgTableWithColumns<any>> = {
        [key in keyof T]?: {
          tableName: string,
          columns: {[key:string]: boolean},
          where?: SQL<unknown>
        }
      }

      type AdminEditResultViewTab = {
		Form: ConstructorOfATypedSvelteComponent
		handleSubmit: (data: { [key: string]: any }) => Promise<AxiosResponse>
		getFormExtras?: () => Promise<{ [key: string]: any }>
		formExtras?: { [key: string]: any }
		formData?: { [key: string]: any }
		formErrors?: FormErrors
		populated?: boolean
		submitted?: boolean
		canSubmit?: boolean
	}

	type AdminEditResultViewTabs = {
		default: AdminEditResultViewTab
		[key: string]: AdminEditResultViewTab
	}
}

export {};
