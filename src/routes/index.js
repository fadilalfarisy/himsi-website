import express from "express"
import admin from './admin.js'
import token from './token.js'
import visiMisi from './visi-misi.js'
import divisiBidang from './divisi-bidang.js'
import faq from './faq.js'
import hubungi from './hubungi.js'
import berita from './berita.js'
import collegeLink from './college-link.js'
import partner from "./partner.js"

const router = express.Router()

router.use('/', admin)
router.use('/', token)
router.use('/', visiMisi)
router.use('/', divisiBidang)
router.use('/', faq)
router.use('/', hubungi)
router.use('/', berita)
router.use('/', collegeLink)
router.use('/', partner)

export default router