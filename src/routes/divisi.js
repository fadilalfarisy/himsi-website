import express from "express"
import divisiController from '../controller/divisi-controller.js'
import auth from "../middleware/auth-user.js"

const divisiBidang = express.Router()

divisiBidang.get('/divisi/', divisiController.getDivisi)
divisiBidang.get('/divisi/:id', divisiController.getDivisiById)
divisiBidang.post('/divisi', auth, divisiController.createDivisi)
divisiBidang.put('/divisi/:id', auth, divisiController.editDivisi)
divisiBidang.delete('/divisi/:id', auth, divisiController.deleteDivisi)

export default divisiBidang