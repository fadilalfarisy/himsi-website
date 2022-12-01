import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import router from './routes/index.js'
import connectToDB from './config/db.js'

connectToDB()

//configuration to access dotenv file
dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()

//middleware
app.use(cors()) //enable cors 
app.use(bodyParser.urlencoded({ extended: false })) //allow request with format x-www-form-urlencoded
app.use(bodyParser.json()) //allow request with format json
app.use(router)

app.listen(PORT, () => console.log(`server running on port ${PORT}`))