const mongoose = require('mongoose');


const OrderItemSchema = new mongoose.Schema({
    Stew_name: {
      type: String,
      required: true,
    },
    solidFood_name: {
      type: String,
      required: true,
    },
  });
// Define the Order schema
const OrderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        // required: true, 
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
        trim: true,
    },
    solidFood_name: {
        type: String,
        // required: true, 
        trim: true,
        trim: true,
    },
    Stew_name: {
        type: String,
        // required: true, 
        trim: true 
    },
    alternative_solidFood_name: {
        type: String,
        trim: true,
        trim: true,
    },
    alternative_stew_name: {
        type: String,
        trim: true 
    },
    orders: {
        type: [OrderItemSchema],
        required: true,
      },
      specific_instructions: {
        type: String,
    },
}, {
    timestamps: true, // Automatically create createdAt and updatedAt fields
    unique: true,
});

// Create the Order model
const Order = mongoose.model('Orders', OrderSchema);

// Export the Order model
module.exports = Order;
