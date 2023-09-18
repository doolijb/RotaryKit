/**
 * Validators that can be used for form validation, client side and server side.
 * 
 * Validator names should be noun + adjective, e.g. "required", "emailAddressComplete".
 */

import { default as telephoneComplete } from "./telephoneComplete/telephoneComplete"
import { default as confirmMatch } from "./confirmMatch/confirmMatch"
import { default as emailAddressComplete } from "./emailAddressComplete/emailAddressComplete"
import { default as lowercaseRequired } from "./lowercaseRequired/lowercaseRequired"
import { default as maxLength } from "./maxLength/maxLength"
import { default as minLength } from "./minLength/minLength"
import { default as numberIncluded } from "./numberIncluded/numberIncluded"
import { default as telephonePossible } from "./telephonePossible/telephonePossible"
import { default as postalCodeComplete } from "./postalCodeComplete/postalCodeComplete"
import { default as required } from "./required/required"
import { default as specialCharIncluded } from "./specialCharIncluded/specialCharIncluded"
import { default as specialCharExcluded} from "./specialCharExcluded/specialCharExcluded"
import { default as uppercaseRequired } from "./uppercaseIncluded/uppercaseIncluded"


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