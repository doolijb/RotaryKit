import type { AnyPgColumn } from "drizzle-orm/pg-core"

function getIsPivotTable(tableConfig): Boolean {
    return !Object.values(tableConfig.columns).find((c:AnyPgColumn) => c.primary)
}

export default {
    getIsPivotTable
}