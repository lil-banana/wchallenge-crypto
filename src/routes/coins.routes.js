import { Router } from 'express'
import * as coinsController from '../controllers/coins.controller'
import { authenticateToken } from '../middlewares'

const router = Router()

/**
 * @swagger
 * /coins:
 *   get:
 *     summary: List available coins
 *     description: List available coins.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         example: JWT
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: per_page
 *         example: 42
 *         schema:
 *           type: integer
 *         required: true
 *         description: The number of results shown in one page. Should be between 1 and 250
 *         default: 100
 *       - in: query
 *         name: page
 *         example: 2
 *         schema:
 *           type: integer
 *         required: true
 *         description: The number of the page. Should be greater than 1
 *         default: 1
 *     responses:
 *       200:
 *         description: A list of available coins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   symbol:
 *                     type: string
 *                   price:
 *                     type: number
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *                   last_updated:
 *                     type: string
*/
router.get('', authenticateToken, coinsController.getAllCoins)

/**
 * @swagger
 * /coins/top:
 *   get:
 *     summary: Gets top n of coins followed by user
 *     description: Gets top n of coins followed by user. Ordered by price in the user preferred currency.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         example: JWT
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: n
 *         example: 10
 *         schema:
 *           type: integer
 *         required: true
 *         description: The number of coins for the top n. Should be between 1 and 25.
 *       - in: query
 *         name: order
 *         example: asc
 *         schema:
 *           type: integer
 *         required: false
 *         description: The order in which the coins will be given for the top. Can be 'asc' and 'desc'.
 *         default: desc
 *     responses:
 *       200:
 *         description: A list of top n coins followed by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   symbol:
 *                     type: string
 *                   price:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         ars:
 *                           type: number
 *                         eur:
 *                           type: number
 *                         usd:
 *                           type: number
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *                   last_updated:
 *                     type: string
*/
router.get('/top', authenticateToken, coinsController.topN)

/**
 * @swagger
 * /coins/follow:
 *   post:
 *     summary: Follows given coin id
 *     description: Follows given coin id.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         example: JWT
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: coinId
 *         example: bitcoin
 *         schema:
 *           type: string
 *         required: true
 *         description: Coin id, check ids available in the /coins endpoint.
 *     responses:
 *       201:
 *         description: Confirmation of coin following
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 message:
 *                   type: string
*/
router.post('/follow', authenticateToken, coinsController.followCoin)

export default router;