import { roles } from "../../middleware/authentication.js";


export const endPoint = {
    profile:[roles.Admin,roles.User]
}