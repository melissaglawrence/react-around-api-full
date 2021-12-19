const express = require('express');

const mongoose = require('mongoose');

require('dotenv').config();

const cors = require('cors');

const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middleware/logger');

const { login, createUser } = require('./controllers/users');

const usersRouter = require('./routes/users');

const cardsRouter = require('./routes/cards');

const { auth } = require('./middleware/auth');

const { corsOptions } = require('./middleware/cors');
const { validate } = require('./models/user');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/arounddb');

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(requestLogger);

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.url');
};

app.use(cors());

app.options('*', cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post(
  '/signup',
  corsOptions,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateUrl),
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
      avatar: Joi.string().custom(validateUrl),
    }),
  }),
  usersRouter
);

app.use(
  '/cards',
  corsOptions,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      link: Joi.string().custom(validateUrl),
    }),
  }),
  cardsRouter
);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.joi) {
    return res.status(400).json({
      error: err.joi.message,
    });
  }
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
