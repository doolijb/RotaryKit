import { v4 as uuid } from "uuid"
import type { PopupSettings } from "@skeletonlabs/skeleton-svelte"

/**
 * Returns the popup settings for the skeleton popup component
 * if we are in the browser, otherwise returns null
 *
 * @returns PopupSettings | null
 */
export function popupSettings(): PopupSettings {
	return {
		event: "hover",
		placement: "bottom",
		target: uuid()
	}
}
