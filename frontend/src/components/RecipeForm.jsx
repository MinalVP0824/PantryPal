import { useState } from 'react';

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
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-[#F7F0DD] border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.15)] -rotate-[0.5deg]"
    >
      <h2 className="font-typewriter text-2xl mb-4 text-ink">What's in your pantry?</h2>

      <div className="flex flex-wrap gap-2 border-b-2 border-dashed border-kraft pb-3 mb-1">
        {ingredients.map((ingredient, index) => (
          <span
            key={index}
            className="bg-sage/20 border border-sage px-2 py-1 text-sm flex items-center gap-1 font-handwritten"
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
          className="flex-1 min-w-[160px] outline-none bg-transparent font-handwritten text-lg placeholder:text-ink/40"
        />
      </div>

      <h3 className="font-typewriter text-sm uppercase tracking-wide mt-5 text-ink/70">Cuisine</h3>
      <select
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        className="border border-kraft bg-[#F7F0DD] rounded-sm p-1 mt-1 font-sans"
      >
        {CUISINES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <h3 className="font-typewriter text-sm uppercase tracking-wide mt-5 text-ink/70">Dietary preferences</h3>
      <div className="flex flex-wrap gap-4 mt-2 font-sans text-sm">
        {DIET_TAGS.map((tag) => (
          <label key={tag} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={dietTags.includes(tag)}
              onChange={() => toggleDietTag(tag)}
              className="accent-gingham"
            />
            {tag}
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 bg-gingham text-[#F7F0DD] px-5 py-2 font-typewriter tracking-wide hover:bg-[#8f3630] active:scale-95 transition-all"
      >
        Generate Recipe
      </button>
    </form>
  );
};

export default RecipeForm;