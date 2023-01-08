import express from "express"
import footerController from '../controller/footer-controller.js'

const footer = express.Router()

footer.get('/footer/', footerController.getFooter)
footer.get('/footer/:id', footerController.getFooterById)
footer.post('/footer', footerController.createFooter)
footer.put('/footer/:id', footerController.editFooter)
footer.delete('/footer/:id', footerController.deleteFooter)

export default footer