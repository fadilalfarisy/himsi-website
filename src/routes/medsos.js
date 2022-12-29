import express from "express"
import medsosController from '../controller/medsos-controller.js'

const medsos = express.Router()

medsos.get('/medsos/', medsosController.getMedsos)
medsos.get('/medsos/:id', medsosController.getMedsosById)
medsos.post('/medsos', medsosController.createMedsos)
medsos.put('/medsos/:id', medsosController.editMedsos)
medsos.delete('/medsos/:id', medsosController.deleteMedsos)

export default medsos