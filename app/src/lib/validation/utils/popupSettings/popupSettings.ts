import {v4 as uuidv4} from "uuid"
import type { PopupSettings } from "@skeletonlabs/skeleton"

/**
 * Returns the popup settings for the skeleton popup component
 * if we are in the browser, otherwise returns null
 * 
 * @returns PopupSettings | null
 */
export default function popupSettings(): PopupSettings {
    // If we are in the browser, return the popup settings,
    // otherwise return null because we are in SSR

    

    return process.env.browser ?{
        event: "hover",
        placement: "bottom",
        target: uuidv4()
    } : null
}
