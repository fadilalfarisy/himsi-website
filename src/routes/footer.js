import express from "express"
import footerController from '../controller/footer-controller.js'
import auth from '../middleware/auth-user.js'

const footer = express.Router()

footer.get('/footer/', footerController.getFooter)
footer.get('/footer/:id', footerController.getFooterById)
footer.post('/footer', auth, footerController.createFooter)
footer.put('/footer/:id', auth, footerController.editFooter)
footer.delete('/footer/:id', auth, footerController.deleteFooter)

export default footer