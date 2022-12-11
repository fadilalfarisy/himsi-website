import express from "express"
import tokenController from '../controller/token-controller.js'

const token = express.Router()

token.get('/token', tokenController.checkToken)

export default token