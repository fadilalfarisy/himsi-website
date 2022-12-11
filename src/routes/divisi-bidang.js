import express from "express"
import divisiController from '../controller/divisi-controller.js'
import auth from "../middleware/auth-user.js"

const divisiBidang = express.Router()

divisiBidang.get('/divisi/', divisiController.getDivisi)
divisiBidang.get('/divisi/:id', divisiController.getDivisiById)
divisiBidang.post('/divisi', divisiController.createDivisi)
divisiBidang.put('/divisi/:id', divisiController.editDivisi)
divisiBidang.delete('/divisi/:id', divisiController.deleteDivisi)

export default divisiBidang