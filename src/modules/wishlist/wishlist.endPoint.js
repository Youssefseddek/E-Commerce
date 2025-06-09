import { roles } from "../../middleware/authentication.js";





export const endPoint = {
    add :[roles.User],
    remove :[roles.User],
    get :[roles.User]
}