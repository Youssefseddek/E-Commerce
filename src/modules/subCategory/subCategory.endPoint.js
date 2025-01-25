import { roles } from "../../middleware/authentication.js";




export const endPoint = {
    add :[roles.Admin,roles.User],
    update :[roles.Admin,roles.User]
}