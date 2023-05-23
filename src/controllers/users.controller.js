const Users = require('../models/users.model');
const Transfers = require('../models/transfers.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  const accountNumber = Math.floor(Math.random() * 900000) + 100000;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await Users.create({
    name: name.toLowerCase(),
    accountNumber,
    password: encryptedPassword,
  });

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    message: 'The user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      accountNumber: user.accountNumber,
      amount: user.amount,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { accountNumber, password } = req.body;

  const user = await Users.findOne({
    where: {
      accountNumber,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError(
        `User with account number:${accountNumber} was not found`,
        404
      )
    );
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError(`Wrong account number or password`, 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      accountNumber: user.accountNumber,
      amount: user.amount,
    },
  });
});

exports.findHistory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Users.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`User with id:${id} was not found`, 404));
  }

  const transfersById = await Transfers.findAll({
    where: {
      senderUserId: id,
    },
  });

  if (!transfersById) {
    return next(new AppError(`User with id:${id} has not made transfers`, 404));
  }

  res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      accountNumber: user.accountNumber,
    },
    tranfersDone: transfersById.length,
    transfersById,
  });
});
