import { db, schema } from "$server/database"
import { hasAdminPermission } from "$server/requests"
import type { RequestEvent } from "@sveltejs/kit"
import { SQL, sql, asc, desc, getTableColumns, is, Column, ilike, or, eq } from "drizzle-orm"
import {
	PgUUID,
	type PgTableWithColumns,
	PgTimestamp,
	PgBoolean,
	PgBigInt53,
	PgBigInt64,
} from "drizzle-orm/pg-core"
import { querySpread, type KitEvent } from "sveltekit-zero-api"
import { Ok } from "sveltekit-zero-api/http"

interface Get {
    query?: GetListQueryParameters
}

function getOrderBySQL(orderBy: string, schema: PgTableWithColumns<any>): SQL<unknown>[] {
	const directions = {
		asc,
		desc
	}

	/**
	 * orderBy will be a string like "id:asc,created_at:desc"
	 */
	if (!orderBy) {
		return undefined
	}

	/**
	 * Split the string into an array of strings,
	 * then split each string into an array of column, direction
	 */
	const orderByList: SQL<unknown>[] = orderBy.split(",").map((orderBy) => {
		const [column, direction] = orderBy.split(":")
		return directions[direction](schema[column])
	})

	return orderByList
}

function getWith<T extends PgTableWithColumns<any>>(
	event: RequestEvent,
	availableRelations: AvailableRelations<T>
): { [key: string]: any } {
	/**
	 * If no relations, skip it
	 */
	if (!availableRelations || Object.keys(availableRelations).length === 0) {
		return undefined
	}

	const retWith = {}

	Object.entries(availableRelations).forEach(([key, { tableName, columns, where = undefined }]) => {
        // TODO: Nested relation support and permissions
		try {
			hasAdminPermission(event, schema[tableName])
			retWith[key] = {
				columns,
				where
			}
		} catch (e) {
			null
		}
	})
	return retWith
}

function canILikeColumn(column: Column<any>, value: string) {
	return !is(column, PgUUID) && !is(column, PgTimestamp) && !is(column, PgBoolean) && !is(column, PgBigInt53) && !is(column, PgBigInt64)
}

function canEqColumn(column: Column<any>, value: string) {
	// If it's a UUID, check if the value is a valid UUID
	if (is(column, PgUUID)) {
		return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(value)
	// Check if value is an integer
	} else if (is(column, PgBigInt53) || is(column, PgBigInt64)) {
		return !isNaN(parseInt(value))
	} else {
		return !is(column, PgTimestamp) && !is(column, PgBoolean)
	}
}

/**
 * This function is used to get the relations for a given request event.
 * 
 * @param {RequestEvent} args.event - The request event.
 * @param {string} args.tableName - The key of the schema table, i.e. "users".
 * @param {Object} args.columns - The db.query columns argument to return in the results.
 * @param {string} args.defaultOrderByString - The default orderBy searchParam, defaults to "createdAt:asc".
 * @param {AvailableRelations<T>} args.availableRelations - The available relations for the table.
 * 
 * @returns {PaginatedResponse<T>}
 */
export async function getListOf<T>({
    event,
    tableName,
    columns,
    availableRelations = undefined,
	defaults = {
		pageLimit: 25,
		orderBy: "createdAt:asc"
	}
}: {
    event: KitEvent<Get, RequestEvent>
    tableName: string,
    columns: {[key:string]: boolean},
    availableRelations?: AvailableRelations
	defaults?: {
		pageLimit?: number,
		orderBy?: string
	}
}) {
	/**
	 * Get the schema for the table
	 */
    const table = schema[tableName]

	/**
	 * Check if the user has permission to view this table
	 * This will throw an exception so we don't need to check the return value
	 */
    hasAdminPermission(event, table)

	////
	// Get our parameters
	////
	
	const query = querySpread(event)
	/** The page we are querying */
    const currentPage = query.currentPage || 1
	/** The number of results per page */
    const pageLimit = query.pageLimit || defaults.pageLimit
	/** The order by parameter */
    const orderBy = query.orderBy || defaults.orderBy
	/** The offset for the query */
    const offset = (currentPage - 1) * pageLimit
	/** The search parameter */
    const search = query.search

	/**
	 * Build the query
	 */
    const queryArgs = {
        columns,
        with: getWith(event, availableRelations),
        orderBy: getOrderBySQL(orderBy, table),
        limit: pageLimit,
        offset,
        where: undefined
    }

	/**
	 * If we have a search parameter, add it to the query.
	 * We will search all columns that support ilike and eq
	 * and build the where clause.
	 */
    if (search) {
        const tableColumns = getTableColumns(table)
        // eslint-disable-next-line @typescript-eslint/ban-types
        const getColumns = (predicate: Function) => Object.keys(columns).filter(key => predicate(tableColumns[key], search))

		/** Columns that support ilike */
        const iLikeColumns = getColumns(canILikeColumn)
		/** Columns that support eq */
        const eqColumns = getColumns(canEqColumn)

		/** Build the where clause */
        queryArgs.where = ((t: PgTableWithColumns<any>, {or, ilike, eq}) => or(
            ...iLikeColumns.map(key => ilike(table[key], `%${search}%`)),
            ...eqColumns.map(key => eq(table[key], search))
        ))
    }

	/**
	 * Build the total count query
	 */
    const totalCountQuery = db.select({totalCount: sql<number>`cast(count(*) as int)`}).from(table)
    queryArgs.where !== undefined && totalCountQuery.where(queryArgs.where(table, {or, ilike, eq}))

	/**
	 * Run the queries
	 */
    const [results, [{totalCount}]] = await Promise.all([
        db.query[tableName].findMany(queryArgs),
        totalCountQuery
    ])

	////
	// Build the response and return it
	////

    const pageCount = Math.ceil(totalCount / pageLimit)
    const resultCount = results.length
    const resultStart = offset + 1
    const resultEnd = offset + resultCount
    const previousPage = currentPage === 1 ? null : currentPage - 1
    const nextPage = currentPage === pageCount ? null : currentPage + 1

    const response: PaginatedResponse<SelectUser> = {
        success: true,
        results,
        resultCount,
        resultStart,
        resultEnd,
        totalCount,
        pageLimit,
        previousPage,
        currentPage,
        nextPage,
        pageCount,
        orderBy,
        search
    }

    return Ok({body:response})
}
