const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {

    const filterObj = (obj, ...allowedFields) => {
      const newObj = {};
      Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
      });
      return newObj;
    };

    const filteredBody = filterObj(req.body, 'title', 'content', 'price');

    
    if (req.file) filteredBody.photo = req.file.filename;

    const doc = await Model.create(req.body);

    console.log(doc)
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {

    const { id } = req.body;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// exports.updateOne = (Model) =>
//   catchAsync(async (req, res, next) => {
//     const { id } = req.body;
//     const update = req.body;

//     const doc = await Model.findByIdAndUpdate(id, update, {
//       new: true,
//       runValidators: true,
//     });

//     if (!doc) {
//       return next(new AppError("No document found with that ID", 404));
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         data: doc,
//       },
//     });
//   });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.body;

    console.log(id);

    // Create an object to hold the fields to update
    const updateFields = {};

    // Loop through the request body and only add fields that are not empty
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
        updateFields[key] = req.body[key];
      }
    });

    // Find the document and update it
    const doc = await Model.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    console.log(doc);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });


exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {

    const { id } = req.body;

    const doc = await Model.findById(id);

    if (popOptions) query = query.populate(popOptions);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
