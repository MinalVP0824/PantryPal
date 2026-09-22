const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, default: '' },
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  servings: { type: Number, required: true },
  ingredients: [ingredientSchema],
  steps: [{ type: String, required: true }],
  cuisine: { type: String },
  dietTags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;