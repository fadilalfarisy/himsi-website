import express from "express"
import faqController from '../controller/faq-controller.js'
import auth from '../middleware/auth-user.js'

const faq = express.Router()

faq.get('/faq/', faqController.getFaq)
faq.get('/faq/:id', faqController.getFaqById)
faq.post('/faq', auth, faqController.createFaq)
faq.put('/faq/:id', auth, faqController.editFaq)
faq.delete('/faq/:id', auth, faqController.deleteFaq)

export default faq