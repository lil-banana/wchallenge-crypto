import { Router } from 'express'
import * as coinsController from '../controllers/coins.controller'
import { authenticateToken } from '../middlewares'

const router = Router()

router.get('', authenticateToken, coinsController.getAllCoins)
router.post('/follow', authenticateToken, coinsController.followCoin)

export default router;