import { Router } from 'express'
import * as coinsController from '../controllers/coins.controller'
import { authenticateToken } from '../middlewares'

const router = Router()

router.get('', authenticateToken, coinsController.getAllCoins)
router.get('/top', authenticateToken, coinsController.topN)
router.post('/follow', authenticateToken, coinsController.followCoin)

export default router;