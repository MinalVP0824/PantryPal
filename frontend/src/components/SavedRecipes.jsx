import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HerbDoodle } from './Doodles';
import LoadingSpinner from './LoadingSpinner';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { showUndoToast } from '../utils/undoToast';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecipes();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/api/recipes');
      setRecipes(response.data);
    } catch (err) {
      console.error('Failed to fetch saved recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e, recipe, index) => {
    e.preventDefault();
    e.stopPropagation();

    setRecipes((prev) => prev.filter((r) => r._id !== recipe._id));

    const restore = () => {
      setRecipes((prev) => {
        if (prev.some((r) => r._id === recipe._id)) return prev;
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, recipe);
        return next;
      });
    };

    showUndoToast({
      message: 'Recipe deleted.',
      onUndo: restore,
      onConfirm: async () => {
        try {
          await api.delete(`/api/recipes/${recipe._id}`);
        } catch (err) {
          console.error('Failed to delete recipe:', err);
          toast.error('Could not delete recipe — it has been restored.');
          restore();
        }
      },
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="font-typewriter text-3xl mb-1">Saved Recipes</h2>
        <div className="flex flex-col items-center text-center py-16 bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)] mt-4">
          <div className="opacity-40">
            <HerbDoodle size={110} />
          </div>
          <p className="text-ink/50 font-handwritten text-xl mt-3">Log in to see your saved recipes.</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-block bg-gingham text-card font-typewriter text-base px-5 py-2.5 mt-5 rounded-sm hover:bg-gingham-dark active:scale-95 transition-all"
          >
            Log In →
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner text="Loading saved recipes..." />;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-typewriter text-3xl mb-1">Saved Recipes</h2>
      <p className="text-ink/60 text-base mb-6 font-sans">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} in your box</p>

      {recipes.length === 0 && (
        <div className="flex flex-col items-center text-center py-16 bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)]">
          <div className="opacity-40 dark:invert">
            <HerbDoodle size={110} />
          </div>
          <p className="text-ink/50 font-handwritten text-xl mt-3">Your recipe box is empty.</p>
          <Link
            to="/generate"
            className="inline-block bg-gingham text-card font-typewriter text-base px-5 py-2.5 mt-5 rounded-sm hover:bg-gingham-dark active:scale-95 transition-all"
          >
            Generate your first recipe →
          </Link>
        </div>
      )}

      <div className="space-y-5">
        {recipes.map((recipe, index) => (
          <Link
            to={`/saved/${recipe._id}`}
            key={recipe._id}
            className={`relative block bg-card border border-kraft rounded-sm shadow-[3px_3px_0_rgba(59,46,34,0.12)] p-6 hover:shadow-[5px_5px_0_rgba(59,46,34,0.25)] hover:-translate-y-0.5 active:scale-[0.98] transition-all ${
              index % 2 === 0 ? 'rotate-[0.3deg]' : '-rotate-[0.3deg]'
            }`}
          >
            <button
              onClick={(e) => handleDelete(e, recipe, index)}
              className="absolute top-4 right-4 text-ink/30 hover:text-gingham font-typewriter text-base active:scale-90 transition-transform"
              title="Delete recipe"
            >
              ✕
            </button>

            <h3 className="font-typewriter text-xl pr-8">{recipe.title}</h3>
            <p className="text-base text-ink/70 font-sans mt-2">
              {recipe.cuisine} • {recipe.servings} servings
              {recipe.dietTags?.length > 0 && ` • ${recipe.dietTags.join(', ')}`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SavedRecipes;