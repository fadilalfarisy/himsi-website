import express from "express"
import visiController from '../controller/visi-controller.js'
import auth from '../middleware/auth-user.js'

const visiMisi = express.Router()

visiMisi.get('/visi', visiController.getVisi)
visiMisi.put('/visi', auth, visiController.saveVisi)

export default visiMisi