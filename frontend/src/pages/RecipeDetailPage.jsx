import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { showUndoToast } from '../utils/undoToast';

const CUISINES = ['Any', 'Italian', 'Indian', 'Mexican', 'Chinese', 'Thai'];
const DIET_TAGS = ['Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Dairy-Free'];

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (err) {
      console.error('Failed to fetch recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setDraft(JSON.parse(JSON.stringify(recipe)));
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(null);
    setEditing(false);
  };

  const updateField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateIngredient = (index, field, value) => {
    setDraft((prev) => {
      const ingredients = [...prev.ingredients];
      ingredients[index] = { ...ingredients[index], [field]: value };
      return { ...prev, ingredients };
    });
  };

  const removeIngredient = (index) => {
    setDraft((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addIngredient = () => {
    setDraft((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: 1, unit: '' }],
    }));
  };

  const updateStep = (index, value) => {
    setDraft((prev) => {
      const steps = [...prev.steps];
      steps[index] = value;
      return { ...prev, steps };
    });
  };

  const removeStep = (index) => {
    setDraft((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const addStep = () => {
    setDraft((prev) => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const toggleDietTag = (tag) => {
    setDraft((prev) => {
      const tags = prev.dietTags || [];
      return {
        ...prev,
        dietTags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
      };
    });
  };

  const saveEdits = async () => {
    setSaving(true);
    try {
      const response = await api.put(`/api/recipes/${id}`, draft);
      setRecipe(response.data);
      setEditing(false);
      setDraft(null);
      toast.success('Recipe updated!');
    } catch (err) {
      console.error('Failed to update recipe:', err);
      toast.error('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    showUndoToast({
      message: 'Recipe deleted.',
      onUndo: () => {},
      onConfirm: async () => {
        try {
          await api.delete(`/api/recipes/${id}`);
        } catch (err) {
          console.error('Failed to delete recipe:', err);
          toast.error('Failed to delete recipe.');
        }
      },
    });
    navigate('/saved');
  };

  if (loading) return <LoadingSpinner text="Loading recipe..." />;
  if (!recipe) return <p className="text-center text-ink/50 mt-8">Recipe not found.</p>;

  return (
    <div>
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-3">
        <Link
          to="/saved"
          className="inline-block font-typewriter text-base bg-card-alt border border-kraft px-4 py-2 rounded-sm text-ink hover:bg-kraft/30 active:scale-95 transition-all"
        >
          ← Back to Saved Recipes
        </Link>

        {!editing && (
          <div className="flex gap-3">
            <button
              onClick={startEditing}
              className="font-typewriter text-base bg-sage text-card px-4 py-2 rounded-sm hover:bg-sage/80 active:scale-95 transition-all"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="font-typewriter text-base bg-gingham text-card px-4 py-2 rounded-sm hover:bg-gingham-dark active:scale-95 transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="max-w-4xl mx-auto mt-6 bg-card border-2 border-kraft rounded-sm shadow-[5px_5px_0_rgba(59,46,34,0.15)] p-10">
          <h2 className="font-typewriter text-2xl mb-6">Editing Recipe</h2>

          <label className="block font-typewriter text-sm uppercase tracking-wide text-ink/70 mb-1.5">Title</label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full border border-kraft bg-card-alt/40 rounded-sm p-3 font-handwritten text-xl mb-5"
          />

          <label className="block font-typewriter text-sm uppercase tracking-wide text-ink/70 mb-1.5">Servings</label>
          <input
            type="number"
            min="1"
            value={draft.servings}
            onChange={(e) => updateField('servings', Number(e.target.value))}
            className="w-28 border border-kraft bg-card-alt/40 rounded-sm p-2.5 font-sans text-base mb-5"
          />

          <label className="block font-typewriter text-sm uppercase tracking-wide text-ink/70 mb-1.5">Cuisine</label>
          <select
            value={draft.cuisine}
            onChange={(e) => updateField('cuisine', e.target.value)}
            className="border border-kraft bg-card-alt/40 rounded-sm p-2.5 font-sans text-base mb-5"
          >
            {CUISINES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="block font-typewriter text-sm uppercase tracking-wide text-ink/70 mb-1.5">Dietary tags</label>
          <div className="flex flex-wrap gap-4 mb-6 font-sans text-base">
            {DIET_TAGS.map((tag) => (
              <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(draft.dietTags || []).includes(tag)}
                  onChange={() => toggleDietTag(tag)}
                  className="accent-gingham w-4 h-4"
                />
                {tag}
              </label>
            ))}
          </div>

          <h3 className="font-typewriter text-base uppercase tracking-wide text-ink/70 border-b border-dashed border-kraft pb-2 mb-3">
            Ingredients
          </h3>
          <div className="space-y-3 mb-4">
            {draft.ingredients.map((ing, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="number"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(index, 'amount', Number(e.target.value))}
                  className="w-20 border border-kraft bg-card-alt/40 rounded-sm p-2 font-sans text-base"
                />
                <input
                  type="text"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  placeholder="unit"
                  className="w-24 border border-kraft bg-card-alt/40 rounded-sm p-2 font-sans text-base"
                />
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="ingredient"
                  className="flex-1 border border-kraft bg-card-alt/40 rounded-sm p-2 font-sans text-base"
                />
                <button
                  onClick={() => removeIngredient(index)}
                  className="text-gingham font-bold text-lg active:scale-90 transition-transform"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addIngredient}
            className="font-typewriter text-sm text-sage hover:underline mb-7"
          >
            + Add ingredient
          </button>

          <h3 className="font-typewriter text-base uppercase tracking-wide text-ink/70 border-b border-dashed border-kraft pb-2 mb-3">
            Steps
          </h3>
          <div className="space-y-3 mb-4">
            {draft.steps.map((step, index) => (
              <div key={index} className="flex gap-3 items-start">
                <span className="font-typewriter text-sm text-ink/50 mt-3">{index + 1}.</span>
                <textarea
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  rows={2}
                  className="flex-1 border border-kraft bg-card-alt/40 rounded-sm p-2.5 font-sans text-base"
                />
                <button
                  onClick={() => removeStep(index)}
                  className="text-gingham font-bold text-lg active:scale-90 transition-transform mt-3"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addStep}
            className="font-typewriter text-sm text-sage hover:underline mb-7 block"
          >
            + Add step
          </button>

          <div className="flex gap-4">
            <button
              onClick={saveEdits}
              disabled={saving}
              className="bg-gingham text-card font-typewriter text-lg px-6 py-3 rounded-sm hover:bg-gingham-dark active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={cancelEditing}
              className="font-typewriter text-base text-ink/60 hover:text-ink active:scale-95 transition-transform"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <RecipeCard recipe={recipe} hideSave={true} />
      )}
    </div>
  );
};

export default RecipeDetailPage;