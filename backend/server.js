require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const Recipe = require('./models/Recipe');
const MealPlan = require('./models/MealPlan');

const app = express();
const PORT = process.env.PORT || 5000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('PantryPal backend is running!');
});

// AI recipe generation
app.post('/api/recipe', async (req, res) => {
  const { ingredients, cuisine, dietTags } = req.body;

  try {
    const prompt = `Create one recipe using these ingredients: ${ingredients.join(', ')}.
Cuisine preference: ${cuisine}.
Dietary restrictions: ${dietTags.length > 0 ? dietTags.join(', ') : 'none'}.

Respond with ONLY a valid JSON object, no other text, no markdown formatting, in exactly this shape:
{
  "title": "Recipe name",
  "servings": 4,
  "ingredients": [
    { "name": "flour", "amount": 2, "unit": "cups" },
    { "name": "eggs", "amount": 3, "unit": "" }
  ],
  "steps": ["step 1", "step 2"]
}

For ingredients with no meaningful unit (like "eggs" or "onions"), use an empty string for unit and just put the count in amount.`;

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const rawText = completion.choices[0].message.content;
    const cleanedText = rawText.replace(/```json|```/g, '').trim();
    const recipe = JSON.parse(cleanedText);

    res.json(recipe);
  } catch (err) {
    console.error('AI generation failed:', err);
    res.status(500).json({ error: 'Failed to generate recipe. Please try again.' });
  }
});

// CREATE - save a recipe to the database
app.post('/api/recipes/save', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    console.error('Failed to save recipe:', err);
    res.status(400).json({ error: 'Failed to save recipe.' });
  }
});

// READ - get all saved recipes (with optional search/filter)
app.get('/api/recipes', async (req, res) => {
  try {
    const { search, dietTag } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (dietTag) {
      filter.dietTags = dietTag;
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error('Failed to fetch recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
});

// READ - get a single recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.json(recipe);
  } catch (err) {
    console.error('Failed to fetch recipe:', err);
    res.status(500).json({ error: 'Failed to fetch recipe.' });
  }
});

// UPDATE - edit an existing recipe
app.put('/api/recipes/:id', async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.json(updatedRecipe);
  } catch (err) {
    console.error('Failed to update recipe:', err);
    res.status(400).json({ error: 'Failed to update recipe.' });
  }
});

// DELETE - remove a recipe
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.json({ message: 'Recipe deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete recipe:', err);
    res.status(500).json({ error: 'Failed to delete recipe.' });
  }
});

// --- Meal Planner routes ---

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['breakfast', 'lunch', 'dinner'];

// Helper: get the existing plan, or create a blank one if none exists yet
const getOrCreatePlan = async () => {
  let plan = await MealPlan.findOne();
  if (!plan) {
    const blankDays = DAYS.map((day) => ({
      day,
      breakfast: { recipe: null },
      lunch: { recipe: null },
      dinner: { recipe: null },
    }));
    plan = await MealPlan.create({ weekLabel: 'Current Week', days: blankDays });
  }
  return plan;
};

// GET the current meal plan, with full recipe details populated
app.get('/api/mealplan', async (req, res) => {
  try {
    const plan = await getOrCreatePlan();
    const populatedPlan = await plan.populate([
      { path: 'days.breakfast.recipe' },
      { path: 'days.lunch.recipe' },
      { path: 'days.dinner.recipe' },
    ]);
    res.json(populatedPlan);
  } catch (err) {
    console.error('Failed to fetch meal plan:', err);
    res.status(500).json({ error: 'Failed to fetch meal plan.' });
  }
});

// POST assign a recipe to a specific day + slot
app.post('/api/mealplan/assign', async (req, res) => {
  try {
    const { day, slot, recipeId } = req.body;

    const plan = await getOrCreatePlan();
    const targetDay = plan.days.find((d) => d.day === day);

    if (!targetDay) {
      return res.status(404).json({ error: 'Day not found in plan.' });
    }
    if (!['breakfast', 'lunch', 'dinner'].includes(slot)) {
      return res.status(400).json({ error: 'Invalid slot.' });
    }

    targetDay[slot].recipe = recipeId;
    await plan.save();

    const populatedPlan = await plan.populate([
      { path: 'days.breakfast.recipe' },
      { path: 'days.lunch.recipe' },
      { path: 'days.dinner.recipe' },
    ]);
    res.json(populatedPlan);
  } catch (err) {
    console.error('Failed to assign recipe:', err);
    res.status(500).json({ error: 'Failed to assign recipe.' });
  }
});

// POST clear a recipe from a specific day + slot
app.post('/api/mealplan/clear', async (req, res) => {
  try {
    const { day, slot } = req.body;

    const plan = await getOrCreatePlan();
    const targetDay = plan.days.find((d) => d.day === day);

    if (!targetDay) {
      return res.status(404).json({ error: 'Day not found in plan.' });
    }
    if (!['breakfast', 'lunch', 'dinner'].includes(slot)) {
      return res.status(400).json({ error: 'Invalid slot.' });
    }

    targetDay[slot].recipe = null;
    await plan.save();

    const populatedPlan = await plan.populate([
      { path: 'days.breakfast.recipe' },
      { path: 'days.lunch.recipe' },
      { path: 'days.dinner.recipe' },
    ]);
    res.json(populatedPlan);
  } catch (err) {
    console.error('Failed to clear slot:', err);
    res.status(500).json({ error: 'Failed to clear slot.' });
  }
});

// GET the grocery list, computed from the current meal plan
app.get('/api/grocery-list', async (req, res) => {
  try {
    const plan = await getOrCreatePlan();
    const populatedPlan = await plan.populate([
      { path: 'days.breakfast.recipe' },
      { path: 'days.lunch.recipe' },
      { path: 'days.dinner.recipe' },
    ]);

    const merged = {};

    populatedPlan.days.forEach((day) => {
      SLOTS.forEach((slot) => {
        const recipe = day[slot]?.recipe;
        if (!recipe) return;

        recipe.ingredients.forEach((ing) => {
          const key = `${ing.name.toLowerCase()}|${ing.unit}`;
          if (merged[key]) {
            merged[key].amount += ing.amount;
          } else {
            merged[key] = { name: ing.name, amount: ing.amount, unit: ing.unit };
          }
        });
      });
    });

    const groceryList = Object.values(merged);
    res.json(groceryList);
  } catch (err) {
    console.error('Failed to build grocery list:', err);
    res.status(500).json({ error: 'Failed to build grocery list.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});