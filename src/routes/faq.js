import express from "express"
import faqController from '../controller/faq-controller.js'

const faq = express.Router()

faq.get('/faq/', faqController.getFaq)
faq.get('/faq/:id', faqController.getFaqById)
faq.post('/faq', faqController.createFaq)
faq.put('/faq/:id', faqController.editFaq)
faq.delete('/faq/:id', faqController.deleteFaq)

export default faq