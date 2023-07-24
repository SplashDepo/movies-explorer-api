import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';

import router from './routes/index.js';

import errorHandler from './middlewares/errorHandler.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

const { PORT = 3000, URL_MONGO = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(URL_MONGO)
  .then(() => console.log('Connect DB'))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('App start');
});
