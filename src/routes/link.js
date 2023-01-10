import express from "express"
import linkController from '../controller/link-controller.js'
import auth from '../middleware/auth-user.js'

const link = express.Router()

link.get('/link/', linkController.getLink)
link.get('/link/:id', linkController.getLinkById)
link.post('/link/', auth, linkController.createLink)
link.put('/link/:id', auth, linkController.editLink)
link.delete('/link/:id', auth, linkController.deleteLink)

export default link