const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', default: null },
});

const daySchema = new mongoose.Schema({
  day: { type: String, required: true },
  breakfast: slotSchema,
  lunch: slotSchema,
  dinner: slotSchema,
});

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekLabel: { type: String, default: 'Current Week' },
  days: [daySchema],
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = MealPlan;