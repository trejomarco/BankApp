const Transfers = require('../models/transfers.model');
const Users = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.transfer = catchAsync(async (req, res, next) => {
  const { amount, senderUserId, receiverUserId } = req.body;

  if (senderUserId === receiverUserId) {
    return next(
      new AppError(
        `Id of the sender user and id of the receiver user cannot be the same`,
        400
      )
    );
  }

  const receiverUser = await Users.findOne({
    where: {
      status: 'active',
      id: receiverUserId,
    },
  });

  if (!receiverUser) {
    return next(
      new AppError(`User with id:${receiverUserId} was not found`, 404)
    );
  }

  const senderUser = await Users.findOne({
    where: {
      status: 'active',
      id: senderUserId,
    },
  });

  if (!senderUser) {
    return next(
      new AppError(`User with id:${senderUserId} was not found`, 404)
    );
  }

  if (amount > senderUser.amount) {
    return next(
      new AppError(
        `User with id:${senderUserId} do not have enough money to make the transfer`,
        400
      )
    );
  }

  await receiverUser.update({ amount: receiverUser.amount + amount });

  await senderUser.update({ amount: senderUser.amount - amount });

  await Transfers.create({
    amount,
    senderUserId,
    receiverUserId,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Successful transfer',
  });
});
