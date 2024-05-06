import express from 'express'

import { homeController } from '../controllers/index.js'
import { chatController } from '../controllers/Chat.js'
import { register, doRegister, login, doLogin, logout, verifyuser } from '../controllers/Auth.js'

import multer from 'multer'
const upload = multer()
const router = express.Router()

router.get('/', homeController)

router.get('/register', register)
router.post('/register', upload.array(), doRegister)

router.get('/login', login)
router.post('/login', upload.array(), doLogin)

router.get('/logout', logout)
router.post('/logout', logout)

router.get('/verifyuser', verifyuser)
router.post('/verifyuser', verifyuser)

router.get('/chat', chatController)

export default router
