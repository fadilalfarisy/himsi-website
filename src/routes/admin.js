import express from "express"
import auth from "../middleware/auth-user.js"
import superAuth from "../middleware/super-auth.js"
import adminController from '../controller/admin-controller.js'

const admin = express.Router()

admin.post('/login', adminController.login)
admin.post('/register', adminController.register)

admin.get('/admin', superAuth, adminController.getAdmin)
admin.get('/admin/:id', adminController.getAdminById)
admin.post('/admin/', adminController.createAdmin)
admin.put('/admin/:id', adminController.editAdmin)
admin.delete('/admin/:id', adminController.deleteAdmin)

export default admin