const factory = require('./handlerFactory');
const Kitchen = require('./../models/kitchenModel');
const catchAsync = require('./../utils/catchAsync');


exports.getAllKitchens = factory.getAll(Kitchen);
exports.createKitchen = factory.createOne(Kitchen);
exports.updateKitchen = factory.updateOne(Kitchen);
exports.deleteKitchen = factory.deleteOne(Kitchen);
