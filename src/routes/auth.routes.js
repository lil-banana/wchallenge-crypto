import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

const router = Router()

router.get('/signup', authController.signup)

export default router;