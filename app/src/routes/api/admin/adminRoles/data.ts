import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, error, validateForm, } from "@requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "@database"
import { utils, forms } from "@validation"
import { emails, users } from "@providers"

/**
 * Admin view for a list of admin roles
 */
async function GET (event: RequestEvent): Promise<PaginatedResponse<SelectUser>> {
    // Check if user is authorized to view users
    // TODO

    const columns: {[key:string]: boolean}  = {
        "id":true,
        "name":true,
        "createdAt":true,
        "updatedAt":true,
    }

    const availableRelations: AvailableRelations<SelectAdminRole>  = {
        toAdminPermissions: {
            columns: {
                adminPermissionId: true,
            },
            with: {
                adminPermission: {
                    columns: {
                        "id":true,
                        "name":true,
                        "action":true,
                        "resource":true,
                    }
                }
            }
        },
        toUsers: {
            columns: {
                userId: true,
            },
            with: {
                user: {
                    columns: {
                        "id":true,
                        "username":true,
                    }
                }
            }
        }
    }

    return adminApi.getListOf<SelectAdminRole>({
        event,
        tableName: "adminRoles",
        columns,
        availableRelations
    })
}

/**
 * @param event 
 */
async function POST(event: RequestEvent): Promise<SelectAdminRole> {
    // Check if user is authorized to create a user
    // TODO

    ////
    // FORM VALIDATION
    ////

    // Create the form
    const form = utils.formValidator({definitions: forms.adminCreateAdminRole})

    // Validate the data, this will automatically throw an error if the data is invalid
    await validateForm({ form, data: event.locals.data})

    ////
    // DATABASE VALIDATION
    ////

    const errors = {}

    // Check if role name is already taken
    if (await db.query.adminRoles.findFirst({where: (r, {eq}) => eq(r.name, event.locals.data.name)})) {
        errors["name"] = {"Taken": "This name is already in use"}
    }

    // If errors, throw an error
    if (Object.entries(errors).length > 0) {
        throw error(400, {
			errors
		})
    }
    
    ////
    // CREATE ADMIN ROLE
    ////

    let adminRoleId: SelectAdminRole["id"]
    let result: SelectAdminRole

    await db.transaction(async (tx) => {
        // Create the role
        [{adminRoleId}] = await tx.insert(schema.adminRoles).values({name: event.locals.data.name}).returning({adminRoleId: schema.adminRoles.id})
    
        // Add the permissions
        await tx.insert(schema.adminRolesToPermissions).values(
            Object.values(event.locals.data.adminPermissions).map((adminPermissionId: string) => ({adminRoleId: adminRoleId, adminPermissionId})))
    }).then(async () => {
        result = await db.query.adminRoles.findFirst({where: (r, {eq}) => eq(r.id, adminRoleId)})
    })

    // Return the user
    return {
        success: true,
        result,
    }
}

export default {
    GET,
    POST
}