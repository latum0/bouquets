import express from 'express';
import cors from 'cors';
import { seqRun } from './db/db.index';
import useBouquets from './routes/bouquet.route';
import useAuth from './routes/auth.route';
import useFleur from './routes/fleur.route';

import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.BASE_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use('/api/bouquets', useBouquets);
app.use('/api/auth', useAuth);
app.use('/api/fleurs', useFleur);

app.use('/public', express.static('public'));

const PORT = process.env.PORT ?? 5000;
const startServer = async () => {
  await seqRun();

  app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
};

startServer();
