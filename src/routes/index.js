import express from "express"
import admin from './admin.js'
import token from './token.js'
import visiMisi from './visi-misi.js'
import divisiBidang from './divisi-bidang.js'

const router = express.Router()

router.use('/', admin)
router.use('/', token)
router.use('/', visiMisi)
router.use('/', divisiBidang)

export default router