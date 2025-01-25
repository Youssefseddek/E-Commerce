import { roles } from "../../middleware/authentication.js";




export const endPoint = {
    get :[roles.Admin],
    add :[roles.Admin],
    update :[roles.Admin],
    delete :[roles.Admin]
}