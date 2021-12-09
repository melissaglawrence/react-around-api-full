const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Not authorized' });
  }
  const token = auth.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '');
  } catch {
    return res.status(403).send({ message: 'Not authorized' });
  }
  req.user = payload;
  next();
};

module.exports = auth;
