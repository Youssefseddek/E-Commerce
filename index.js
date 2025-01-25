import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import express from 'express'
import { appRouter } from './src/modules/index.router.js'

// set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })


const app = express()

// setup port and baseUrl
const port = process.env.PORT || 300




appRouter(app)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))