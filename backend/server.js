require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const Recipe = require('./models/Recipe');
const MealPlan = require('./models/MealPlan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authMiddleware = require('./middleware/auth');

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

// AI recipe generation — public, no login needed
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

// CREATE - save a recipe (protected)
app.post('/api/recipes/save', authMiddleware, async (req, res) => {
  try {
    const newRecipe = new Recipe({ ...req.body, user: req.userId });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    console.error('Failed to save recipe:', err);
    res.status(400).json({ error: 'Failed to save recipe.' });
  }
});

// READ - get this user's saved recipes (protected)
app.get('/api/recipes', authMiddleware, async (req, res) => {
  try {
    const { search, dietTag } = req.query;
    const filter = { user: req.userId };

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

// READ - get a single recipe by ID (protected, must be the owner)
app.get('/api/recipes/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.userId });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.json(recipe);
  } catch (err) {
    console.error('Failed to fetch recipe:', err);
    res.status(500).json({ error: 'Failed to fetch recipe.' });
  }
});

// UPDATE - edit an existing recipe (protected, must be the owner)
app.put('/api/recipes/:id', authMiddleware, async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
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

// DELETE - remove a recipe (protected, must be the owner)
app.delete('/api/recipes/:id', authMiddleware, async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deletedRecipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.json({ message: 'Recipe deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete recipe:', err);
    res.status(500).json({ error: 'Failed to delete recipe.' });
  }
});

// --- Meal Planner routes (all protected) ---

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['breakfast', 'lunch', 'dinner'];

const getOrCreatePlan = async (userId) => {
  let plan = await MealPlan.findOne({ user: userId });
  if (!plan) {
    const blankDays = DAYS.map((day) => ({
      day,
      breakfast: { recipe: null },
      lunch: { recipe: null },
      dinner: { recipe: null },
    }));
    plan = await MealPlan.create({ user: userId, weekLabel: 'Current Week', days: blankDays });
  }
  return plan;
};

app.get('/api/mealplan', authMiddleware, async (req, res) => {
  try {
    const plan = await getOrCreatePlan(req.userId);
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

app.post('/api/mealplan/assign', authMiddleware, async (req, res) => {
  try {
    const { day, slot, recipeId } = req.body;

    const plan = await getOrCreatePlan(req.userId);
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

app.post('/api/mealplan/clear', authMiddleware, async (req, res) => {
  try {
    const { day, slot } = req.body;

    const plan = await getOrCreatePlan(req.userId);
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

// GET the grocery list, computed from this user's meal plan (protected)
app.get('/api/grocery-list', authMiddleware, async (req, res) => {
  try {
    const plan = await getOrCreatePlan(req.userId);
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

// --- Auth routes (public) ---

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ token, email: user.email });
  } catch (err) {
    console.error('Signup failed:', err);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, email: user.email });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});