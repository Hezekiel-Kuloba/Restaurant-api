const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    image: String,
  });
  
  const Mealpdf = mongoose.model('Mealpdf', mealSchema);

module.exports = Mealpdf;