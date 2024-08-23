const mongoose = require('mongoose');

// Define the Meal schema
const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true, 
        trim: true 
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

// Create the Meal model
const Meal = mongoose.model('Meal', mealSchema);

// Export the Meal model
module.exports = Meal;
