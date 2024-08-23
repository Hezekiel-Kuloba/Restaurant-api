const factory = require('./handlerFactory');
const Order = require('./../models/orderModel');
const catchAsync = require('./../utils/catchAsync');


exports.getAllOrders = factory.getAll(Order);
exports.createOrder = factory.createOne(Order);
exports.deleteOrder = factory.deleteOne(Order);


