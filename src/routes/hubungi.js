import express from "express"
import hubungiController from '../controller/hubungi-controller.js'

const hubungi = express.Router()

hubungi.get('/hubungikami/', hubungiController.getHubungi)
hubungi.get('/hubungikami/:id', hubungiController.getHubungiById)
hubungi.post('/hubungikami', hubungiController.createHubungi)
hubungi.put('/hubungikami/:id', hubungiController.editHubungi)
hubungi.delete('/hubungikami/:id', hubungiController.deleteHubungi)

export default hubungi