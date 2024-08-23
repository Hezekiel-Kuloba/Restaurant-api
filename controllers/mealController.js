const factory = require('./handlerFactory');
const Meal = require('./../models/mealModel');
const catchAsync = require('./../utils/catchAsync');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

exports.uploadMealPhoto = upload.single('imageFile');


// Function to upload image to Cloudinary
const uploadImage = async (imageUrl) => {
  try {
      const uploadResult = await cloudinary.uploader.upload(imageUrl);
      return uploadResult.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
      throw new Error('Image upload failed: ' + error.message);
  }
};

// Create Meal with Image Upload
exports.createMealWithImage = catchAsync(async (req, res, next) => {
  const imageFile = req.file; // Access the uploaded file
//  / console.log(req.body)
  const {category,quantity,description,name}=req.body;

  if (!imageFile) {
    return next(new Error('Please upload an image file.'));
  }

  console.log(category);

  // Upload the image to Cloudinary
  const imageUrlFromCloudinary = await uploadImage(imageFile.path);
  // Upload the image to Cloudinary
  // const imageUrlFromCloudinary = await uploadImage(imageUrl);
  // console.log(imageUrl)

  // Create a new meal with the image URL
  const newMeal = await Meal.create({
        image: imageUrlFromCloudinary, // Save the image URL in the meal document
        description,
        category,
        name,
        quantity,
  });

  res.status(201).json({
      status: 'success',
      data: {
          meal: newMeal,
      },
  });
});


exports.getAllMeals = factory.getAll(Meal);
exports.getMeal = factory.getOne(Meal);
exports.createMeal = factory.createOne(Meal);
exports.updateMeal = factory.updateOne(Meal);
exports.deleteMeal = factory.deleteOne(Meal);

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