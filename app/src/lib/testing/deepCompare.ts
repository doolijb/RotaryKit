export default function deepCompare(obj1: any, obj2: any, path: string[] = []): boolean {
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            console.error(`Array length mismatch at ${path.join(".")}: expected ${obj2.length}, got ${obj1.length}`);
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            if (!deepCompare(obj1[i], obj2[i], [...path, i.toString()])) {
                return false;
            }
        }
        return true;
    } else if (typeof obj1 === "object" && obj1 !== null && typeof obj2 === "object" && obj2 !== null) {
        const keys1 = Object.keys(obj1).sort();
        const keys2 = Object.keys(obj2).sort();
        if (!deepCompare(keys1, keys2, [...path, "keys"])) {
            return false;
        }
        for (const key of keys1) {
            if (!deepCompare(obj1[key], obj2[key], [...path, key])) {
                return false;
            }
        }
        return true;
    } else if (typeof obj1 === "function" && typeof obj2 === "function") {
        if (obj1.toString() !== obj2.toString()) {
            console.error(`Function mismatch at ${path.join(".")}: expected ${obj2.toString()}, got ${obj1.toString()}`);
            return false;
        }
        return true;
    } else {
        if (obj1 !== obj2) {
            console.error(`Value mismatch at ${path.join(".")}: expected ${obj2}, got ${obj1}`);
            return false;
        }
        return true;
    }
}