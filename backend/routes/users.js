const router = require('express').Router();
const {
  getUsersInfo,
  getUsersId,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsersInfo);
router.get('/:id', getUsersId);
router.get('/users/me', getCurrentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
