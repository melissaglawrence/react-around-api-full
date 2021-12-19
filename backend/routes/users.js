const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getUsersInfo,
  getUsersId,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.url');
};

router.get(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  getUsersInfo
);
router.get(
  '/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  getCurrentUser
);
router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().alphanum().length(24),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  getUsersId
);
router.patch(
  '/me',
  celebrate({
    params: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  updateUser
);
router.patch(
  '/me/avatar',
  celebrate({
    params: Joi.object().keys({
      avatar: Joi.string().custom(validateUrl),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  updateUserAvatar
);

module.exports = router;
