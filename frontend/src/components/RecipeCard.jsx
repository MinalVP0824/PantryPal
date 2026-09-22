import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RecipeCard = ({ recipe, hideSave }) => {
  const [servings, setServings] = useState(recipe?.servings || 1);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!recipe) {
    return (
      <p className="text-center text-ink/50 mt-8 font-handwritten text-lg">
        No recipe yet — fill out the form and generate one!
      </p>
    );
  }

  const scaleFactor = servings / recipe.servings;

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/recipes/save', recipe);
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
    <div className="relative max-w-xl mx-auto mt-10">
      <div className="absolute -top-3 left-8 w-16 h-6 bg-[#E8D9A8]/70 border border-kraft/40 rotate-[-4deg] shadow-sm z-10"></div>

      <div className="bg-[#F7F0DD] border-2 border-kraft rounded-sm shadow-[5px_5px_0_rgba(59,46,34,0.15)] rotate-[0.4deg] p-6">
        <div className="flex justify-between items-start gap-3">
          <h2 className="font-typewriter text-2xl leading-snug">{recipe.title}</h2>
          {!hideSave && (
            <button
              onClick={handleSave}
              disabled={saved || saving}
              className="shrink-0 font-typewriter text-sm bg-sage text-[#F7F0DD] px-3 py-1 disabled:bg-kraft/60 active:scale-95 transition-transform"
            >
              {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 font-sans text-sm">
          <span className="text-ink/70">Servings:</span>
          <button
            onClick={() => setServings(Math.max(1, servings - 1))}
            className="border border-kraft w-6 h-6 flex items-center justify-center active:scale-90 transition-transform"
          >
            -
          </button>
          <span className="font-handwritten text-lg">{servings}</span>
          <button
            onClick={() => setServings(servings + 1)}
            className="border border-kraft w-6 h-6 flex items-center justify-center active:scale-90 transition-transform"
          >
            +
          </button>
        </div>

        <h3 className="font-typewriter text-sm uppercase tracking-wide mt-6 text-ink/70 border-b border-dashed border-kraft pb-1">
          Ingredients
        </h3>
        <ul className="mt-2 space-y-1 font-handwritten text-lg">
          {recipe.ingredients.map((item, index) => (
            <li key={index}>
              {(item.amount * scaleFactor).toFixed(1)} {item.unit} {item.name}
            </li>
          ))}
        </ul>

        <h3 className="font-typewriter text-sm uppercase tracking-wide mt-6 text-ink/70 border-b border-dashed border-kraft pb-1">
          Steps
        </h3>
        <ol className="mt-2 space-y-2 font-sans list-decimal list-inside">
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeCard;