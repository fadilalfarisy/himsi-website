import express from "express"
import admin from './admin.js'
import token from './token.js'
import visiMisi from './visi-misi.js'
import divisiBidang from './divisi-bidang.js'
import faq from './faq.js'
import collegeLink from './college-link.js'

const router = express.Router()

router.use('/', admin)
router.use('/', token)
router.use('/', visiMisi)
router.use('/', divisiBidang)
router.use('/', faq)
router.use('/', collegeLink)

export default router