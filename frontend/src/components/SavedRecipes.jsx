import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HerbDoodle } from './Doodles';
import LoadingSpinner from './LoadingSpinner';
import { showUndoToast } from '../utils/undoToast';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recipes');
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

    // Optimistically remove it from the list right away...
    setRecipes((prev) => prev.filter((r) => r._id !== recipe._id));

    const restore = () => {
      setRecipes((prev) => {
        if (prev.some((r) => r._id === recipe._id)) return prev;
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, recipe);
        return next;
      });
    };

    // ...but don't actually delete it from the server until the undo window passes.
    showUndoToast({
      message: 'Recipe deleted.',
      onUndo: restore,
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/recipes/${recipe._id}`);
        } catch (err) {
          console.error('Failed to delete recipe:', err);
          toast.error('Could not delete recipe — it has been restored.');
          restore();
        }
      },
    });
  };

  if (loading) return <LoadingSpinner text="Loading saved recipes..." />;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="font-typewriter text-2xl mb-1">Saved Recipes</h2>
      <p className="text-ink/60 text-sm mb-5 font-sans">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} in your box</p>

      {recipes.length === 0 && (
        <div className="flex flex-col items-center text-center py-12 bg-[#F7F0DD] border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)]">
          <div className="opacity-40">
            <HerbDoodle size={100} />
          </div>
          <p className="text-ink/50 font-handwritten text-lg mt-2">Your recipe box is empty.</p>
          <Link
            to="/generate"
            className="inline-block bg-gingham text-[#F7F0DD] font-typewriter text-sm px-4 py-2 mt-4 rounded-sm hover:bg-[#8f3630] active:scale-95 transition-all"
          >
            Generate your first recipe →
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {recipes.map((recipe, index) => (
          <Link
            to={`/saved/${recipe._id}`}
            key={recipe._id}
            className={`relative block bg-[#F7F0DD] border border-kraft rounded-sm shadow-[3px_3px_0_rgba(59,46,34,0.12)] p-4 hover:shadow-[5px_5px_0_rgba(59,46,34,0.25)] hover:-translate-y-0.5 active:scale-[0.98] transition-all ${
              index % 2 === 0 ? 'rotate-[0.3deg]' : '-rotate-[0.3deg]'
            }`}
          >
            <button
              onClick={(e) => handleDelete(e, recipe, index)}
              className="absolute top-3 right-3 text-ink/30 hover:text-gingham font-typewriter text-sm active:scale-90 transition-transform"
              title="Delete recipe"
            >
              ✕
            </button>

            <h3 className="font-typewriter text-lg pr-6">{recipe.title}</h3>
            <p className="text-sm text-ink/70 font-sans mt-1">
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