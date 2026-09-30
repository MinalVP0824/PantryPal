import { useState } from 'react';
import { GarlicDoodle } from './Doodles';

const CUISINES = ['Any', 'Italian', 'Indian', 'Mexican', 'Chinese', 'Thai'];
const DIET_TAGS = ['Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Dairy-Free'];

const RecipeForm = ({ onGenerate }) => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [cuisine, setCuisine] = useState('Any');
  const [dietTags, setDietTags] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !ingredients.includes(trimmed)) {
        setIngredients([...ingredients, trimmed]);
      }
      setInputValue('');
    }
  };

  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const toggleDietTag = (tag) => {
    if (dietTags.includes(tag)) {
      setDietTags(dietTags.filter((t) => t !== tag));
    } else {
      setDietTags([...dietTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ ingredients, cuisine, dietTags });
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute -top-3 left-10 w-20 h-6 bg-card-alt/70 border border-kraft/40 rotate-[-3deg] shadow-sm z-10"></div>
      <div className="absolute -bottom-4 -right-4 opacity-[0.15] dark:invert pointer-events-none rotate-[12deg]">
        <GarlicDoodle size={90} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative p-10 bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.15)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-typewriter text-3xl text-ink">What's in your pantry?</h2>
          <span className="text-gingham text-2xl">🍅</span>
        </div>

        <div className="flex flex-wrap gap-2.5 border-b-2 border-dashed border-kraft pb-5 mb-2">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="bg-sage/20 border border-sage px-3 py-2 text-base flex items-center gap-2 font-handwritten"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="font-bold text-gingham cursor-pointer active:scale-90 transition-transform"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type an ingredient and press Enter"
            className="flex-1 min-w-[240px] outline-none bg-transparent font-handwritten text-2xl placeholder:text-ink/40"
          />
        </div>

        <h3 className="font-typewriter text-base uppercase tracking-wide mt-8 text-ink/70">Cuisine</h3>
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="border border-kraft bg-card rounded-sm p-2.5 mt-2 font-sans text-base"
        >
          {CUISINES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <h3 className="font-typewriter text-base uppercase tracking-wide mt-8 text-ink/70">Dietary preferences</h3>
        <div className="flex flex-wrap gap-5 mt-3 font-sans text-base">
          {DIET_TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dietTags.includes(tag)}
                onChange={() => toggleDietTag(tag)}
                className="accent-gingham w-4 h-4"
              />
              {tag}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-9 bg-gingham text-card px-8 py-3.5 text-lg font-typewriter tracking-wide hover:bg-gingham-dark active:scale-95 transition-all"
        >
          Generate Recipe
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;