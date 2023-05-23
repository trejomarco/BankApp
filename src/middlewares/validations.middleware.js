const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

exports.createUserValidation = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validFields,
];

exports.loginUserValidation = [
  body('accountNumber')
    .notEmpty()
    .withMessage('Account Number cannot be empty')
    .isLength({ min: 6, max: 6 })
    .withMessage('Account number must be 6 digits'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validFields,
];

exports.transferValidation = [
  body('amount')
    .notEmpty()
    .withMessage('Amount cannot be empty')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer'),
  body('senderUserId')
    .notEmpty()
    .withMessage('User Id cannot be empty')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer'),
  body('receiverUserId')
    .notEmpty()
    .withMessage('User Id cannot be empty')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer'),
  validFields,
];
