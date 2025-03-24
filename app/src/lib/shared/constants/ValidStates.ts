export class ValidStates {
	static readonly VALID = "Valid"
	static readonly INVALID = "Invalid"
	static readonly NONE = "None"

	static readonly Options:
		typeof ValidStates.VALID |
		typeof ValidStates.INVALID |
		typeof ValidStates.NONE
}
