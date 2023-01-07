import express from "express"
import admin from './admin.js'
import token from './token.js'
import visiMisi from './visi-misi.js'
import faq from './faq.js'
import berita from './berita.js'
import link from './link.js'
import himpunan from "./himpunan.js"
import event from "./events.js"
import bidang from "./bidang.js"
import divisi from './divisi.js'
import pengurus from "./pengurus.js"
import newsletter from "./newsletter.js"

const router = express.Router()

router.use('/', admin)
router.use('/', token)
router.use('/', himpunan)
router.use('/', visiMisi)
router.use('/', faq)
router.use('/', berita)
router.use('/', link)
router.use('/', event)
router.use('/', bidang)
router.use('/', divisi)
router.use('/', pengurus)
router.use('/', newsletter)

export default router