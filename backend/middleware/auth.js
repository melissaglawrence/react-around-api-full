const jwt = require('jsonwebtoken');
require('dotenv').config();

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
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch {
    return res.status(403).send({ message: 'Not authorized' });
  }
  req.user = payload;
  next();
};

module.exports = { auth };
