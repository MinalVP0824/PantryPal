import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading recipe..." />;
  if (!recipe) return <p className="text-center text-ink/50 mt-8">Recipe not found.</p>;

  return (
    <div>
      <Link
        to="/saved"
        className="inline-block font-typewriter text-sm bg-[#E8D9A8] border border-kraft px-3 py-1.5 rounded-sm text-ink hover:bg-kraft/30 active:scale-95 transition-all mb-2"
      >
        ← Back to Saved Recipes
      </Link>
      <RecipeCard recipe={recipe} hideSave={true} />
    </div>
  );
};

export default RecipeDetailPage;