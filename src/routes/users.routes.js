const usersController = require('../controllers/users.controller');
// const usersMiddleware = require('../middlewares/users.middleware');

const validationMiddleware = require('../middlewares/validations.middleware');

const { Router } = require('express');

const router = Router();

router.post(
  '/signup',
  validationMiddleware.createUserValidation,
  usersController.signup
);

router.post(
  '/login',
  validationMiddleware.loginUserValidation,
  usersController.login
);

router.get('/:id/history', usersController.findHistory);

module.exports = router;
