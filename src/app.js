import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import 'dotenv/config'

import '../src/database'

import authRoutes from './routes/auth.routes'
import coinsRoutes from './routes/coins.routes'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WChallenge Crypto API',
      version: '1.0.0',
      description: 'a CoinGecko wrapper with added authentication services'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./src/routes/*.js']
}

const specs = swaggerJsdoc(options);

const app = express();

app.set('port', 3000);


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/auth', authRoutes);
app.use('/coins', coinsRoutes);

export default app;