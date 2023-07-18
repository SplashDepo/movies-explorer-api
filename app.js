import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import routerUser from './routes/users.js';
import routerMovie from './routes/movies.js';
import routerSignin from './routes/signin.js';
import routerSignup from './routes/signup.js';

import auth from './middlewares/auth.js';

const { PORT = 3000, URL_MONGO = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(URL_MONGO)
  .then(() => console.log('Connect DB'))
  .catch((err) => console.log(err));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/signin', routerSignin);
app.use('/signup', routerSignup);

app.use(auth);

app.use('/users', routerUser);
app.use('/movies', routerMovie);

app.listen(PORT, () => {
  console.log('приложение запущено');
});
