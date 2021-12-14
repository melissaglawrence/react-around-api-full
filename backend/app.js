const express = require('express');

const mongoose = require('mongoose');

require('dotenv').config();

const cors = require('cors');

const { celebrate, Joi } = require('celebrate');

const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middleware/logger');

const { login, createUser } = require('./controllers/users');

const usersRouter = require('./routes/users');

const cardsRouter = require('./routes/cards');

const { auth } = require('./middleware/auth');

const { corsOptions } = require('./middleware/cors');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/arounddb');

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(requestLogger);

app.use(cors());

app.post(
  '/signup',
  corsOptions,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.post(
  '/signin',
  corsOptions,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.use(auth);

app.use(
  '/users',
  corsOptions,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().required(),
    }),
  }),
  usersRouter
);

app.use(
  '/cards',
  corsOptions,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().uri().required(),
    }),
  }),
  cardsRouter
);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.joi) {
    return res.status(400).json({
      error: err.joi.message,
    });
  }
  res.status(500).send({ message: 'An error occurred on the server' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
