type ValueType = "unknown" | "uuid" | "number" | "date" | "url" | "boolean"

function isNumber(value: number | string): boolean {
    if (typeof value === 'number') {
        return !isNaN(value) && isFinite(value);
    } else if (typeof value === 'string') {
        return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
    }
    return false;
}

function isDate(value: string): boolean {
    // Regular expression to match common date formats including ISO 8601
    const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return dateRegex.test(value);
}

function isUUID(value: string): boolean {
    return value.length === 36 && value[8] === "-" && value[13] === "-" && value[18] === "-" && value[23] === "-";
}

function differentiateType(value: number | string | boolean): ValueType {
    if (typeof value === 'boolean') {
        return 'boolean'
    } else if (typeof value === 'string' && value.startsWith("http")) {
        return 'url';
    } else if (typeof value === 'string' && isUUID(value)) {
        return 'uuid';
    } else if (typeof value === 'string' && isDate(value)) {
        return 'date';
    } else if (isNumber(value)) {
        return 'number';
    } else {
        return 'unknown';
    }
}

export function getDisplayAndCopyText(value: string | number | boolean | undefined) {
    let copyText: string
    let displayText: string | boolean | number | undefined
    const type = differentiateType(value)

    switch (type as ValueType) {
        case 'boolean':
        case 'unknown':
        case 'number':
            displayText = value
            copyText = `${value}`
            break
        case 'url':
            displayText = value
            break
        case "uuid":
            displayText = (value as string).slice(0, 8)
            copyText = `${value}`
            break
        case 'date':
            // eslint-disable-next-line no-case-declarations
            const date = new Date(value as string)
            // eslint-disable-next-line no-case-declarations
            const day = date.toLocaleDateString()
            // eslint-disable-next-line no-case-declarations
            const time = date.toLocaleTimeString()
            displayText = day + " " + time
            copyText = day + " " + time
            break
    }

    return { displayText, copyText, type }
}