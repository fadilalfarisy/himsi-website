import express from "express"
import newsLetterController from "../controller/newsletter-controller.js"

const newsletter = express.Router()

// newsletter.get('/audience', newsLetterController.getAllAudience)
// newsletter.get('/audience/:id', newsLetterController.getSpecificAudience)
// newsletter.get('/members/:id', newsLetterController.getAllMember)
// newsletter.get('/member/:id', newsLetterController.getSpecificMember)
newsletter.post('/member', newsLetterController.createMember)
newsletter.put('/member', newsLetterController.updateMember)
newsletter.delete('/member', newsLetterController.deleteMember)
newsletter.get('/confirmation', newsLetterController.successSubcribed)

export default newsletter