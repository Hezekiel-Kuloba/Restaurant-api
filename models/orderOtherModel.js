const mongoose = require('mongoose');
const validator = require('validator');

// Define the Order schema
const OrderOtherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please tell us your first name!']
      },
    lastName: {
        type: String,
        required: [true, 'Please tell us your last name!']
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: [true, 'Please provide a phone number'],
        validate: [validator.isMobilePhone, 'Please provide a valid phone number']
    },
    solidFood_name: {
        type: String,
        required: true, 
        trim: true,
        trim: true,
    },
    Stew_name: {
        type: String,
        required: true, 
        trim: true 
    },
    alternative_solidFood_name: {
        type: String,
        required: true, 
        trim: true,
        trim: true,
    },
    alternative_stew_name: {
        type: String,
        required: true, 
        trim: true 
    },
    specific_instructions: {
        type: String,
    },
}, {
    timestamps: true, // Automatically create createdAt and updatedAt fields
    unique: true,
});

// Create the Order model
const OrderOther = mongoose.model('Orders', OrderOtherSchema);

// Export the Order model
module.exports = OrderOther;
