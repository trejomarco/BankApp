const transfersController = require('../controllers/transfers.controller');

const validationMiddleware = require('../middlewares/validations.middleware');

const { Router } = require('express');

const router = Router();

router.post(
  '/',
  validationMiddleware.transferValidation,
  transfersController.transfer
);

module.exports = router;
