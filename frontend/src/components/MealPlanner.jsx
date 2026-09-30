import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { showUndoToast } from '../utils/undoToast';
import LoadingSpinner from './LoadingSpinner';
import { HerbDoodle } from './Doodles';

const SLOTS = ['breakfast', 'lunch', 'dinner'];

const MealPlanner = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [pickerTarget, setPickerTarget] = useState(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchPlan();
      fetchSavedRecipes();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchPlan = async () => {
    try {
      const response = await api.get('/api/mealplan');
      setPlan(response.data);
    } catch (err) {
      console.error('Failed to fetch meal plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const response = await api.get('/api/recipes');
      setSavedRecipes(response.data);
    } catch (err) {
      console.error('Failed to fetch saved recipes:', err);
    }
  };

  const handleAssign = async (recipeId) => {
    try {
      const response = await api.post('/api/mealplan/assign', {
        day: pickerTarget.day,
        slot: pickerTarget.slot,
        recipeId,
      });
      setPlan(response.data);
      setPickerTarget(null);
    } catch (err) {
      console.error('Failed to assign recipe:', err);
    }
  };

  const setSlotRecipe = (currentPlan, day, slot, recipeValue) => {
    return {
      ...currentPlan,
      days: currentPlan.days.map((d) =>
        d.day === day
          ? { ...d, [slot]: { ...d[slot], recipe: recipeValue } }
          : d
      ),
    };
  };

  const handleClear = (e, day, slot) => {
    e.stopPropagation();

    const targetDay = plan.days.find((d) => d.day === day);
    const previousRecipe = targetDay[slot]?.recipe;
    if (!previousRecipe) return;

    setPlan((prev) => setSlotRecipe(prev, day, slot, null));

    const restore = () => {
      setPlan((prev) => setSlotRecipe(prev, day, slot, previousRecipe));
    };

    showUndoToast({
      message: 'Removed from plan.',
      onUndo: restore,
      onConfirm: async () => {
        try {
          await api.post('/api/mealplan/clear', { day, slot });
        } catch (err) {
          console.error('Failed to clear slot:', err);
          restore();
        }
      },
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="font-typewriter text-3xl mb-6">Weekly Meal Plan</h2>
        <div className="flex flex-col items-center text-center py-16 bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)]">
          <div className="opacity-40">
            <HerbDoodle size={110} />
          </div>
          <p className="text-ink/50 font-handwritten text-xl mt-3">Log in to plan your week.</p>
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

  if (loading) return <LoadingSpinner text="Loading meal plan..." />;
  if (!plan) return <p className="text-center text-ink/50 mt-8">Could not load meal plan.</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-typewriter text-3xl mb-6">Weekly Meal Plan</h2>

      <div className="bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)] p-6 overflow-x-auto">
        <div className="grid grid-cols-8 gap-px bg-gingham/40 min-w-[820px]">
          <div className="bg-card"></div>
          {plan.days.map((d) => (
            <div key={d.day} className="bg-card-alt/50 font-typewriter text-sm uppercase tracking-wide text-center py-3">
              {d.day.slice(0, 3)}
            </div>
          ))}

          {SLOTS.map((slot) => (
            <>
              <div key={slot} className="bg-card-alt/50 font-typewriter text-sm uppercase tracking-wide flex items-center px-3 capitalize">
                {slot}
              </div>
              {plan.days.map((d) => (
                <div
                  key={d.day + slot}
                  onClick={() => setPickerTarget({ day: d.day, slot })}
                  className="relative bg-card p-3 min-h-[90px] text-sm cursor-pointer hover:bg-card-alt/40 active:scale-[0.97] transition-all font-sans"
                >
                  {d[slot]?.recipe ? (
                    <>
                      <button
                        onClick={(e) => handleClear(e, d.day, slot)}
                        className="absolute top-1.5 right-1.5 text-ink/30 hover:text-gingham text-base leading-none active:scale-90 transition-transform"
                        title="Remove"
                      >
                        ×
                      </button>
                      <span className="font-handwritten text-base leading-tight pr-3 block">{d[slot].recipe.title}</span>
                    </>
                  ) : (
                    <span className="text-ink/30">+ add</span>
                  )}
                </div>
              ))}
            </>
          ))}
        </div>
      </div>

      {pickerTarget && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-20 p-4">
          <div className="bg-card border-2 border-kraft rounded-sm shadow-[5px_5px_0_rgba(59,46,34,0.2)] p-6 max-w-md w-full max-h-[70vh] overflow-y-auto">
            <h3 className="font-typewriter text-xl mb-4 border-b border-dashed border-kraft pb-3">
              {pickerTarget.day} — {pickerTarget.slot}
            </h3>
            {savedRecipes.map((r) => (
              <div
                key={r._id}
                onClick={() => handleAssign(r._id)}
                className="py-3 border-b border-kraft/20 cursor-pointer hover:bg-card-alt/40 active:scale-[0.98] transition-all font-handwritten text-xl"
              >
                {r.title}
              </div>
            ))}
            <button
              onClick={() => setPickerTarget(null)}
              className="mt-5 font-sans text-base text-ink/50 hover:text-ink active:scale-95 transition-transform"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;