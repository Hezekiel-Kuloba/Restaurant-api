const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A blog name must have less or equal then 40 characters'],
      minlength: [10, 'A blog name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'blog name must only contain characters']
    },
    slug: String,
    
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    price: {
      type: Number,
      required: [true, 'A blog must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'A blog must have a description']
    },
    // imageCover: {
    //   type: String,
    //   required: [true, 'A blog must have a cover image']
    // },
    photo: {
      type: String,
      default: 'defaultBlog.jpg'
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// blogSchema.index({ price: 1 });
blogSchema.index({ price: 1, ratingsAverage: -1 });
blogSchema.index({ slug: 1 });


// Virtual populate
blogSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'blog',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
blogSchema.pre('save', function(next) {
  // this.slug = slugify(this.title, { lower: true });
  next();
});


const blog = mongoose.model('blog', blogSchema);

module.exports = blog;
