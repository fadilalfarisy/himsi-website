import express from "express"
import newsLetterController from "../controller/newsletter-controller.js"

const newsletter = express.Router()

newsletter.get('/audience', newsLetterController.getAllAudience)
newsletter.get('/audience/:id', newsLetterController.getSpecificAudience)
newsletter.get('/members/:id', newsLetterController.getAllMember)
newsletter.get('/member/:id', newsLetterController.getSpecificMember)
newsletter.post('/member/:id', newsLetterController.createMember)
newsletter.put('/member/:id', newsLetterController.updateMember)
newsletter.delete('/member/:id', newsLetterController.deleteMember)

export default newsletter