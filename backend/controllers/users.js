const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  RequestError,
  AuthError,
  NotFoundError,
  ConflictError,
} = require('../error/errors');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!email || !password) {
        throw new RequestError('Missing Required fields');
      } else if (!user) {
        throw new AuthError('User not found');
      }

      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production'
          ? process.env.JWT_SECRET
          : 'dev-secret',
        {
          expiresIn: '7d',
        }
      );
      return res.send({ token });
    })
    .catch((err) => {
      if (err) {
        next(new AuthError('Not authorized'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        throw new ConflictError('User already exists');
      }
    })
    .catch(next);
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash }).then(
        (user) => {
          res.status(201).send({ _id: user._id });
        }
      );
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

const getUsersInfo = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => {
      if (!user) {
        throw new AuthError('Not authorized');
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

const getUsersId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => {
      if (!user) {
        throw new RequestError('No user with matching ID found');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => {
      if (!user) {
        throw new RequestError('No user with matching ID found');
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => {
      if (!user) {
        throw new RequestError('No user with matching ID found');
      }
      res.status(200).send({ user: user });
    })
    .catch(next);
};

module.exports = {
  getUsersInfo,
  getUsersId,
  createUser,
  login,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
};
