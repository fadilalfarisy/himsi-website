import express from "express"
import collegeLinkController from '../controller/collegeLink-controller.js'

const collegeLink = express.Router()

collegeLink.get('/college-link/', collegeLinkController.getCollegeLink)
collegeLink.get('/college-link/:id', collegeLinkController.getCollegeLinkById)
collegeLink.post('/college-link/', collegeLinkController.createCollegeLink)
collegeLink.put('/college-link/:id', collegeLinkController.editCollegeLink)
collegeLink.delete('/college-link/:id', collegeLinkController.deleteCollegeLink)

export default collegeLink