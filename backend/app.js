const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/arounddb');

const { requestLogger, errorLogger } = require('./middleware/logger');

const { login, createUser } = require('./controllers/users');

const usersRouter = require('./routes/users');

const cardsRouter = require('./routes/cards');

const auth = require('./middleware/auth');

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(requestLogger);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().max(30),
      password: Joi.string().min(6),
    }),
  }),
  createUser
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().min(2).max(30),
      password: Joi.string().min(2).max(40),
    }),
  }),
  login
);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use(errors());

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'An error occurred on the server' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
