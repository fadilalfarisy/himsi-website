import express from "express"
import admin from './admin.js'
import token from './token.js'
import profile from './profile.js'

const router = express.Router()

router.use('/', admin)
router.use('/', token)
router.use('/profile', profile)

export default router