import { v2 as cloudinary } from 'cloudinary'
import path from 'path'
import { fileURLToPath } from 'url'
// set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '../../config/.env') })


// Configuration
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret 
});


export default cloudinary