const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      const error = new Error('No cards found');
      error.statusCode = 404;
      throw error;
    })
    .then((cards) => res.status(200).send({ cards }))
    .catch((err) => {
      if (err.message === 'No cards found') {
        res.status(404).send({ message: 'No cards found' });
      }
      res.status(500).send({ message: 'An error has occurred on the server' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      const ERROR__CODE = 400;
      if (err.name === 'ValidationError') {
        throw res.status(ERROR__CODE).send({
          message: `${err.message} `,
        });
      }
      res.status(500).send({ message: 'An error has occurred on the server' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.id)
    .orFail(() => {
      const error = new Error('No card found');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.message === 'No card found') {
        res.status(404).send({ message: 'No card found' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'No card with that id' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } })
    .orFail(() => {
      const error = new Error('No card found');
      error.statusCode = 404;
      throw error;
    })
    .then((like) => {
      res.status(200).send({ likes: like });
    })
    .catch((err) => {
      if (err.message === 'No card found') {
        res.status(404).send({ message: 'No card found' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'No card with that id' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } })
    .orFail(() => {
      const error = new Error('No card found');
      error.statusCode = 404;
      throw error;
    })
    .then((dislike) => {
      res.status(200).send({ likes: dislike });
    })
    .catch((err) => {
      if (err.message === 'No card found') {
        res.status(404).send({ message: 'No card found' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'No card with that id' });
      }
      return res.status(500).send({ message: err.message });
    });
};
module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
