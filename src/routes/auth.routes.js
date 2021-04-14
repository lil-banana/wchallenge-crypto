import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

const router = Router()

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Creates a new user
 *     description: Creates a new user. Gives back a JWT access token to use throughout the api.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - username
 *               - password
 *               - currency
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Doe
 *               username:
 *                 type: string
 *                 example: jduser
 *               password:
 *                 type: string
 *                 example: password
 *                 description: Alphanumeric, at least 8 characters long
 *               currency:
 *                 type: string
 *                 example: usd
 *                 description: Available currencies = ars, eur, usd
 *     responses:
 *       201:
 *         description: A JWT access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
*/
router.post('/signup', authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     description: Logs in a user. Gives back a JWT access token to use throughout the api.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: A JWT access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: JWT
*/
router.post('/login', authController.login);

export default router;