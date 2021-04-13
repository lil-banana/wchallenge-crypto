import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'

import '../src/database'

import authRoutes from './routes/auth.routes'
import coinsRoutes from './routes/coins.routes'


const app = express();

app.set('port', 3000);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/coins', coinsRoutes);

export default app;