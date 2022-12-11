import express from "express"
import auth from "../middleware/auth-user.js"
import adminController from '../controller/admin-controller.js'

const admin = express.Router()

admin.post('/login', adminController.login)
admin.post('/register', adminController.register)
admin.get('/', auth, adminController.listAdmin)

export default admin