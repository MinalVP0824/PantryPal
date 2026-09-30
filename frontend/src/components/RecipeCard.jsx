import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const RecipeCard = ({ recipe, hideSave }) => {
  const [servings, setServings] = useState(recipe?.servings || 1);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!recipe) {
    return (
      <p className="text-center text-ink/50 mt-8 font-handwritten text-lg">
        No recipe yet — fill out the form and generate one!
      </p>
    );
  }

  const scaleFactor = servings / recipe.servings;

  const handleSave = async () => {
    if (!isLoggedIn) {
      toast('Log in to save recipes.', { icon: '🔒' });
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      const scaledRecipe = {
        ...recipe,
        servings: servings,
        ingredients: recipe.ingredients.map((item) => ({
          ...item,
          amount: Number((item.amount * scaleFactor).toFixed(2)),
        })),
      };
      await api.post('/api/recipes/save', scaledRecipe);
      setSaved(true);
      toast.success('Recipe saved!');
    } catch (err) {
      toast.error('Failed to save recipe.');
      console.error('Failed to save recipe:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10">
      <div className="absolute -top-3 left-10 w-20 h-6 bg-card-alt/70 border border-kraft/40 rotate-[-4deg] shadow-sm z-10"></div>

      <div className="bg-card border-2 border-kraft rounded-sm shadow-[5px_5px_0_rgba(59,46,34,0.15)] rotate-[0.4deg] p-10">
        <div className="flex justify-between items-start gap-3">
          <h2 className="font-typewriter text-3xl leading-snug">{recipe.title}</h2>
          {!hideSave && (
            <button
              onClick={handleSave}
              disabled={saved || saving}
              className="shrink-0 font-typewriter text-base bg-sage text-card px-4 py-1.5 disabled:bg-kraft/60 active:scale-95 transition-transform"
            >
              {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mt-5 font-sans text-base">
          <span className="text-ink/70">Servings:</span>
          <button
            onClick={() => setServings(Math.max(1, servings - 1))}
            className="border border-kraft w-8 h-8 flex items-center justify-center active:scale-90 transition-transform"
          >
            -
          </button>
          <span className="font-handwritten text-xl">{servings}</span>
          <button
            onClick={() => setServings(servings + 1)}
            className="border border-kraft w-8 h-8 flex items-center justify-center active:scale-90 transition-transform"
          >
            +
          </button>
        </div>

        <h3 className="font-typewriter text-base uppercase tracking-wide mt-8 text-ink/70 border-b border-dashed border-kraft pb-2">
          Ingredients
        </h3>
        <ul className="mt-3 space-y-1.5 font-handwritten text-xl">
          {recipe.ingredients.map((item, index) => (
            <li key={index}>
              {(item.amount * scaleFactor).toFixed(1)} {item.unit} {item.name}
            </li>
          ))}
        </ul>

        <h3 className="font-typewriter text-base uppercase tracking-wide mt-8 text-ink/70 border-b border-dashed border-kraft pb-2">
          Steps
        </h3>
        <ol className="mt-3 space-y-3 font-sans text-base list-decimal list-inside">
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeCard;