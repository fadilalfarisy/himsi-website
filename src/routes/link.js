import express from "express"
import linkController from '../controller/link-controller.js'

const link = express.Router()

link.get('/link/', linkController.getLink)
link.get('/link/:id', linkController.getLinkById)
link.post('/link/', linkController.createLink)
link.put('/link/:id', linkController.editLink)
link.delete('/link/:id', linkController.deleteLink)

export default link