const jwt = require('jsonwebtoken');
require('dotenv').config();

const { AuthError } = require('../error/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Not authorized' });
  }
  const token = auth.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV === 'production'
        ? process.env.JWT_SECRET
        : 'dev-secret'
    );
  } catch (err) {
    throw new AuthError('Not authorized');
  }
  req.user = payload;
  next();
};

module.exports = { auth };
