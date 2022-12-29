import express from "express"
import visiController from '../controller/visi-controller.js'

const visiMisi = express.Router()

visiMisi.post('/visi', visiController.saveVisi)
visiMisi.delete('/visi', visiController.deleteVisi)

export default visiMisi