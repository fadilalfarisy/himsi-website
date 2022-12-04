import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import router from './routes/index.js'
import config from "./config/config.js"

//config
const { PORT, MONGO_URI } = config

try {
    mongoose.connect(MONGO_URI, { useNewUrlParser: true })
    console.log('connect to db')
} catch (error) {
    console.log(error.message)
};

const app = express()

//middleware
app.use(cors()) //enable cors 
app.use(cookieParser()); //allow to access cookie
app.use(bodyParser.urlencoded({ extended: false })) //allow request with format x-www-form-urlencoded
app.use(bodyParser.json()) //allow request with format json
app.use(router)

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

