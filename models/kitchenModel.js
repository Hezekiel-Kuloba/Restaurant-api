const mongoose = require('mongoose');

// Define the KitchenRules schema
const kitchenRuleSchema = new mongoose.Schema({
    rule: {
        type: String,
        required: true, 
        unique: true,
        trim: true,
    },
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

// Create the KitchenRules model
const KitchenRules = mongoose.model('KitchenRules', kitchenRuleSchema);

// Export the KitchenRules model
module.exports = KitchenRules;
