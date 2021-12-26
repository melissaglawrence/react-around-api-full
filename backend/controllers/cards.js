const Card = require('../models/card');

const { RequestError, AuthError, NotFoundError } = require('../error/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new RequestError('Bad request');
    })
    .then((cards) => {
      if (!cards) {
        throw new AuthError('Not authorized');
      }
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.id)
    .orFail(() => {
      throw new RequestError('Bad request');
    })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('No card with matching ID found');
      }
      res.status(200).send({ card });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new RequestError('Bad request');
    })
    .then((like) => {
      res.status(200).send({ card: like });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new RequestError('Bad request');
    })
    .then((dislike) => {
      res.status(200).send({ card: dislike });
    })
    .catch(next);
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
