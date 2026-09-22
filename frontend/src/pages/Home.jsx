import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RecipeForm from '../components/RecipeForm';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DoodleBackground from '../components/DoodleBackground';

const Home = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRecipe = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/recipe', formData);
      setRecipe(response.data);
    } catch (err) {
      toast.error('Something went wrong while generating your recipe.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (recipe) {
    return (
      <div className="fixed inset-0 z-40 bg-paper overflow-y-auto">
        <DoodleBackground />
        <button
          onClick={() => setRecipe(null)}
          className="fixed top-4 left-4 md:left-16 bg-[#F7F0DD] border border-kraft px-3.5 py-2 rounded-sm font-typewriter text-sm hover:bg-[#E8D9A8]/40 transition-colors z-50 shadow-[3px_3px_0_rgba(59,46,34,0.15)]"
        >
          ← Start over
        </button>
        <div className="relative z-10 pt-20 pb-16 px-6">
          <RecipeCard recipe={recipe} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <RecipeForm onGenerate={generateRecipe} />
      {loading && <LoadingSpinner text="Generating recipe..." fullPage={false} />}
    </div>
  );
};

export default Home;