import cors from 'cors';
import 'dotenv/config';
import express, { Application } from 'express';

import { connectDB } from '~/configs/database';
import routes from './routes';

const app: Application = express();
const port = process.env.API_PORT || 8080;

// connect database
try {
  (async () => {
    await connectDB();
  })();
} catch (error) {
  console.log('Error connect db !!!', error);
}

app.use(cors({ origin: '*' }));
app.use(express.json());

// routes
routes(app);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
