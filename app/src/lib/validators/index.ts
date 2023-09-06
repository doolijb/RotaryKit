/**
 * Validators that can be used for form validation, client side and server side.
 * 
 * Validator names should be noun + adjective, e.g. "required", "emailAddressComplete".
 */

import { default as telephoneComplete } from "./telephoneComplete"
import { default as confirmMatch } from "./confirmMatch"
import { default as emailAddressComplete } from "./emailAddressComplete"
import { default as lowercaseRequired } from "./lowercaseRequired"
import { default as maxLength } from "./maxLength"
import { default as minLength } from "./minLength"
import { default as numberIncluded } from "./numberIncluded"
import { default as telephonePossible } from "./telephonePossible"
import { default as postalCodeComplete } from "./postalCodeComplete"
import { default as required } from "./required"
import { default as specialCharIncluded } from "./specialCharIncluded"
import { default as specialCharExcluded} from "./specialCharExcluded"
import { default as uppercaseRequired } from "./uppercaseIncluded"


export default {
    confirmMatch,
    emailAddressComplete,
    lowercaseRequired,
    maxLength,
    minLength,
    numberIncluded,
    postalCodeComplete,
    required,
    specialCharExcluded,
    specialCharIncluded,
    telephoneComplete,
    telephonePossible,
    uppercaseRequired,
}