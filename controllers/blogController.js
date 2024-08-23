const factory = require('./handlerFactory');
const Blog = require('./../models/blogModel');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(file) 
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadBlogImages = upload.single('photo');

exports.resizeBlogImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `blog-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(1000, 1000)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/blogs/${req.file.filename}`);

  next();
});


exports.getAllBlogs = factory.getAll(Blog);
exports.getBlog = factory.getOne(Blog);
exports.createBlog = factory.createOne(Blog);
exports.updateBlog = factory.updateOne(Blog);
exports.deleteBlog = factory.deleteOne(Blog);

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