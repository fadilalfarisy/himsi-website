import express from "express"
import visiController from '../controller/visi-controller.js'

const visiMisi = express.Router()

//visiMisi.get('/visi', visiController.getVisi)
//visiMisi.get('/visi/:id', visiController.getVisiById)
visiMisi.post('/visi', visiController.createVisi)
visiMisi.put('/visi', visiController.editVisi)
visiMisi.delete('/visi', visiController.deleteVisi)

export default visiMisi