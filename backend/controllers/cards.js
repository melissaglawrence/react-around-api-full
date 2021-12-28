const Card = require('../models/card');

const {
  RequestError,
  AuthError,
  NotFoundError,
  ForbiddenError,
} = require('../error/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new NotFoundError('No cards found');
    })
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.id)
    .orFail(() => {
      throw new NotFoundError('No cards found');
    })
    .then((card) => {
      if (!card) {
        throw new RequestError('Invalid id');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Cannot delete other users cards');
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === 400) {
        throw new RequestError('No card with that id found');
      } else {
        next(err);
      }
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
      throw new NotFoundError('No cards found');
    })
    .then((like) => {
      if (!like) {
        throw new RequestError('Invalid id');
      }
      res.status(200).send({ card: like });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === 400) {
        throw new RequestError('No card with that id found');
      } else {
        next(err);
      }
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
      throw new NotFoundError('No cards found');
    })
    .then((dislike) => {
      if (!dislike) {
        throw new RequestError('Invalid id');
      }
      res.status(200).send({ card: dislike });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === 400) {
        throw new RequestError('No card with that id found');
      } else {
        next(err);
      }
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
