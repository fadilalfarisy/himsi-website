import express from "express"
import admin from './admin.js'
import token from './token.js'

const router = express.Router()

router.use('/admin', admin)
router.use('/token', token)

export default router