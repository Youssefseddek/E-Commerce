import { roles } from "../../middleware/authentication.js";




export const endPoint = {
    add :[roles.Admin,roles.User],
    remove :[roles.Admin,roles.User],
    clear :[roles.Admin,roles.User]
    get :[roles.Admin,roles.User]
}