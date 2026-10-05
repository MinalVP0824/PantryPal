# PantryPal

PantryPal is an AI recipe generator and weekly meal planner. Tell it what is in your kitchen and what you feel like eating, and it writes a full recipe you can scale, save, drop into a weekly plan, and turn into a single grocery list. It is built with the MERN stack and uses the Groq API for recipe generation.

**Live demo:** https://pantrypal-17ve.onrender.com

The app is hosted on Render's free tier, so the first load after a quiet period can take 30 to 60 seconds while the server wakes up.

## Features

- **AI recipe generation:** enter ingredients and preferences and get a complete recipe with ingredients, quantities and steps. No account needed.
- **Servings scaler:** change the number of servings and every ingredient amount updates to match.
- **Saved recipes:** save recipes to your account, search them, filter by diet tag, and open any one in a detail page. Deleting a recipe shows an undo toast.
- **Weekly meal planner:** assign saved recipes to days and meals, and remove them again with undo.
- **Grocery list:** ingredients from everything in your meal plan are merged into one shopping list.
- **Soft authentication:** browsing and generating are open to everyone. An account is only needed to save recipes and use the planner.
- **Light and dark mode:** the choice is remembered between visits.
- **Responsive UI:** a handmade, parchment and gingham look with hand-drawn doodles, built with Tailwind CSS.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Tailwind CSS, Axios, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI | Groq API (`openai/gpt-oss-120b`) |
| Auth | JSON Web Tokens, bcryptjs |
| Hosting | Render |

## How It Works

1. The user submits ingredients and preferences from the React frontend.
2. The Express server sends a structured prompt to the Groq API and asks for the recipe as JSON.
3. The server cleans and parses the response and returns it to the client.
4. Logged-in users can save the recipe. It is stored in MongoDB and linked to their account.
5. Saved recipes can be assigned to the weekly plan, and the grocery list is built by merging the ingredients across the plan.

In production, Express also serves the built React app, so the frontend and backend run as one service on the same origin.

## Project Structure

```
PantryPal/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── MealPlan.js
│   │   ├── Recipe.js
│   │   └── User.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB Atlas cluster (the free tier is enough)
- A Groq API key from https://console.groq.com

### Setup

Clone the repository:

```bash
git clone https://github.com/MinalVP0824/PantryPal.git
cd PantryPal
```

**Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/pantrypal?appName=Cluster0
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=any_long_random_string
```

Make sure the database name `pantrypal` is in the connection string. Without it MongoDB falls back to a database called `test`.

```bash
npm run dev
```

**Frontend**

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

The app runs at http://localhost:5173.

## Production Build

To run the app the way it runs in production, with Express serving the built frontend:

```bash
cd frontend
npm run build

cd ../backend
node server.js
```

Then open http://localhost:5000. Leave `VITE_API_URL` unset for this build so the frontend calls the same origin.

## Deployment

PantryPal is deployed as a single Render web service.

- **Build command:** `cd frontend && npm install && npm run build && cd ../backend && npm install`
- **Start command:** `cd backend && node server.js`
- **Environment variables:** `MONGODB_URI`, `GROQ_API_KEY`, `JWT_SECRET`
- **MongoDB Atlas:** allow access from `0.0.0.0/0` under Network Access, since Render's free tier does not use a fixed IP.

Render redeploys automatically on every push to `main`.

## API Overview

Routes marked with auth need an `Authorization: Bearer <token>` header. The token is returned by the signup and login routes.

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/recipe` | No | Generate a recipe with the LLM |
| POST | `/api/auth/signup` | No | Create an account |
| POST | `/api/auth/login` | No | Log in and receive a token |
| POST | `/api/recipes/save` | Yes | Save a recipe |
| GET | `/api/recipes` | Yes | List saved recipes (supports `search` and `dietTag`) |
| GET | `/api/recipes/:id` | Yes | Get one saved recipe |
| PUT | `/api/recipes/:id` | Yes | Update a saved recipe |
| DELETE | `/api/recipes/:id` | Yes | Delete a saved recipe |
| GET | `/api/mealplan` | Yes | Get the weekly meal plan |
| POST | `/api/mealplan/assign` | Yes | Assign a recipe to a day and meal |
| POST | `/api/mealplan/clear` | Yes | Clear a slot in the plan |
| GET | `/api/grocery-list` | Yes | Get the merged grocery list |

## Known Limitations

- The grocery list merges items by name and unit. It does not convert between units, so "1 cup" and "240 ml" of the same ingredient stay as separate lines.
- Recipes are written by an LLM, so quantities and cooking times are sensible but not always perfect. Check them before you cook.
- The Groq free tier has rate limits, so heavy use may briefly return an error.

## Future Improvements

- AI-generated recipe images
- Unit conversion in the grocery list
- Favorites, custom tags and richer search
- Multiple meal plans

## Author

**Minal Venkatesha Poppur**
B.E. Artificial Intelligence and Machine Learning, CMR Institute of Technology

[GitHub](https://github.com/MinalVP0824) | [LinkedIn](https://www.linkedin.com/in/minal-venkatesha-b45805388)
