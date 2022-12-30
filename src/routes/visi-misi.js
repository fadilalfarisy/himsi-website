import express from "express"
import visiController from '../controller/visi-controller.js'

const visiMisi = express.Router()

visiMisi.get('/visi', visiController.getVisi)
visiMisi.put('/visi', visiController.saveVisi)

export default visiMisi