// See https://kit.svelte.dev/docs/types#app

import { schema } from "$database"
import type { FormSchema, Primitive } from "$validation/base"
import { schema } from "$database"
import type { offset } from "@floating-ui/dom"

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
            userTokenId?: string
        }
		interface PageData {
            title?: string
            description?: string
            keywords?: string
            user?: SelectUser
        }
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

    ////
    // FORMS
    ////

    type ValidatorData<K extends string, T> = {
        [key: K]: T
    }

    // type ValidatorTest<T> = ({key, data}:{key:string, data:ValidatorData<key, T>}) => Promise<boolean>

    type ValidatorTest = ({key, data}:{key:string, data:Record<string, unknown>}) => Promise<boolean>;

	type GenericOfPrimitive<T extends Primitive> = T["type"];
    
    interface FieldErrors {
        [key: string]: string
    }

    interface FormErrors {
        [key: string]: FieldErrors
    }

    type FormDataOf<T extends FormSchema> = {
        [K in keyof Required<Pick<T["fields"], Exclude<keyof T["fields"], keyof T["optional"]>>>]: GenericOfPrimitive<T["fields"][K]>
    } & {
        [K in keyof Pick<T["fields"], keyof T["optional"]>]?: GenericOfPrimitive<T["fields"][K]>
    }

    interface FormFieldAttributes {
        label?: string
        placeholder?: string
        defaultValue?: any
        description?: string
    }

    ////
    // DATABASE AND SCHEMA
    ////

    type DbTransaction = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>
    
    type SelectUser = typeof schema.users.$inferSelect
    type SelectUserToken = typeof schema.userTokens.$inferSelect
    type SelectEmail = typeof schema.emails.$inferSelect
    type SelectEmailVerification = typeof schema.emailVerifications.$inferSelect
    type SelectPassphrase = typeof schema.passphrases.$inferSelect
    type SelectPassphraseReset = typeof schema.passphraseResets.$inferSelect
    type SelectAdminPermission = typeof schema.adminPermissions.$inferSelect
    type SelectAdminRole = typeof schema.adminRoles.$inferSelect
    type SelectAdminRolesToPermissions = typeof schema.adminRolesToPermissions.$inferSelect
    type SelectUsersToAdminRoles = typeof schema.usersToAdminRoles.$inferSelect

    type InsertUser = typeof schema.users.$inferInsert
    type InsertUserToken = typeof schema.userTokens.$inferInsert
    type InsertEmail = typeof schema.emails.$inferInsert
    type InsertEmailVerification = typeof schema.emailVerifications.$inferInsert
    type InsertPassphrase = typeof schema.passphrases.$inferInsert
    type InsertPassphraseReset = typeof schema.passphraseResets.$inferInsert
    type InsertAdminPermission = typeof schema.adminPermissions.$inferInsert
    type InsertAdminRole = typeof schema.adminRoles.$inferInsert
    type InsertAdminRolesToPermissions = typeof schema.adminRolesToPermissions.$inferInsert
    type InsertUsersToAdminRoles = typeof schema.usersToAdminRoles.$inferInsert

    ////
    // UNORGANIZED
    ////

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
    
    type AvailableRelations = {
        [key: string]: {
          tableName: string,
          columns: {[key:string]: boolean},
          where?: SQL<unknown>
        }
      }

    interface SvelteResponse<T> {
        status: number;
        ok: boolean;
        body: T;
    }
    
    type Callback<T> = (response: SvelteResponse<T>) => any

    type ApiRequest = Promise<any> & {
        Success: (cb: Callback<KitResponse>) => ApiRequest;
        ClientError?: (cb: Callback<KitResponse>) => ApiRequest;
        ServerError?: (cb: Callback<KitResponse>) => ApiRequest;
    }

    interface ApiMethods {
        GET?: ({query}: {
            query?: {[key:string]: any}
        }) => ApiRequest
        POST?: ({body, query}: {
            body?: {[key:string]: any}
            query: {[key:string]: any}
        }) => ApiRequest
        PUT?: ({body, query}: {
            body?: any
            query: {[key:string]: any}
        }) => ApiRequest
        DELETE?: ({query}: {
            query?: {[key:string]: any}
        }) => ApiRequest
    }

    interface ResourceApi {
        POST?: ApiMethods.POST
        GET?: ApiMethods.GET
        PUT?: ApiMethods.PUT
        DELETE?: ApiMethods.DELETE
        resourceId$?: (uuid: string) => ApiMethods
    }

    type AdminEditResultViewTab = {
		FormComponent: ConstructorOfATypedSvelteComponent
		onSubmit: ({data}) => ApiRequest
		getExtras?: () => Promise<{ [key: string]: any }>
		extras?: { [key: string]: any }
		data?: { [key: string]: any }
		errors?: FormErrors
        disabled?: boolean
		populated?: boolean
		submitted?: boolean
		canSubmit?: boolean
        isLoaded?: boolean
	}

    interface GetListQueryParameters {
        currentPage?: number,
        pageLimit?: number,
        orderBy?: string,
        offset?: number,
        search?: string,
    }

	type AdminEditResultViewTabs = {
		default: AdminEditResultViewTab
		[key: string]: AdminEditResultViewTab
	}

}

export {};
