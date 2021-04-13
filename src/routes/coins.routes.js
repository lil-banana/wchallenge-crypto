import { Router } from 'express'
import * as coinsController from '../controllers/coins.controller'

const router = Router()

router.get('', coinsController.getAllCoins)

export default router;