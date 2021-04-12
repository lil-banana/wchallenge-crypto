import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

import '../src/database'

import authRoutes from './routes/auth.routes'

const app = express()

app.set('port', 3000);

app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRoutes);

export default app;