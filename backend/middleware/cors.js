// const allowedOrigins = [
//   'http://localhost:3001',
//   'https://insta-mock.onrender.com',
// ];

// const allowedMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];

// const corsOptions = (req, res, next) => {
//   const { origin } = req.headers;
//   const { method } = req.method;
//   const requestHeaders = req.headers['Access-Control-Request-Headers'];
//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', allowedMethods);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }
//   next();
// };

// module.exports = { corsOptions };

const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3001', 'https://insta-mock.onrender.com'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions);
