import { db, schema } from "@database"
import type { Boolean } from "aws-sdk/clients/apigateway"
import { getTableConfig, type AnyPgColumn } from "drizzle-orm/pg-core"


const actionsMap = {
    GET: "Read",
    POST: "Create",
    PUT: "Update",
    DELETE: "Delete",
}


function getIsPivotTable(tableConfig): Boolean {
    return !Object.values(tableConfig.columns).find((c:AnyPgColumn) => c.primary)
}


/**
 * Seeds the staff_permissions table with the default permissions for staff members.
 * Only inserts missing or new permissions.
 * Permissions are automatically generated for database schema containing an "id" column.
 * Pivot tables should be ignored.
 */
export default async function staffPermissions({
    tx=db,
}:{
    tx?: typeof db
}={}): Promise<void>{
    
    // Get all of the current permissions
    const existingPermissions = await tx.query.staffPermissions.findMany()
    const insertPermissions: InsertStaffPermission[] = []

    for (const [key, value] of Object.entries(schema)) {
        try {
            // Get table configuration
            const tableConfig = getTableConfig(value)

            // If the table is a pivot table, skip it
            if (getIsPivotTable(tableConfig)) {
                continue
            }
    
            // Create a human readable name for the table
            const baseName = (tableConfig.name.replace(/_/g, ' ')).replace(/\b\w/g, l => l.toUpperCase())

            // For each action
            for (const [action, actionName] of Object.entries(actionsMap)) {
                // Create a human readable name for the action
                const name = `${actionName} ${baseName}`

                // If the permission already exists, skip it
                if(!existingPermissions.find(p => p.action === action && p.resource === tableConfig.name)){
                    // Insert the permission into the table
                    insertPermissions.push({
                        action: action,
                        resource: tableConfig.name,
                        name
                    });
                }
            }
    
        } catch (e) {
            console.log(`• ${key} - ${e}`)
        }

        // Execute the insertions
        if (insertPermissions.length) {
            await tx.insert(schema.staffPermissions).values(insertPermissions)
        }
    }
}
