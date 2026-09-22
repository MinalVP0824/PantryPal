import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { showUndoToast } from '../utils/undoToast';

const SLOTS = ['breakfast', 'lunch', 'dinner'];

const MealPlanner = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [pickerTarget, setPickerTarget] = useState(null);

  useEffect(() => {
    fetchPlan();
    fetchSavedRecipes();
  }, []);

  const fetchPlan = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mealplan');
      setPlan(response.data);
    } catch (err) {
      console.error('Failed to fetch meal plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recipes');
      setSavedRecipes(response.data);
    } catch (err) {
      console.error('Failed to fetch saved recipes:', err);
    }
  };

  const handleAssign = async (recipeId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/mealplan/assign', {
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

  const handleClear = (e, day, slot) => {
    e.stopPropagation();

    const targetDay = plan.days.find((d) => d.day === day);
    const previousEntry = targetDay?.[slot];
    if (!previousEntry?.recipe) return;

    // Optimistically clear the slot right away...
    setPlan((prev) => ({
      ...prev,
      days: prev.days.map((d) => (d.day === day ? { ...d, [slot]: { recipe: null } } : d)),
    }));

    const restore = () => {
      setPlan((prev) => ({
        ...prev,
        days: prev.days.map((d) => (d.day === day ? { ...d, [slot]: previousEntry } : d)),
      }));
    };

    // ...but don't actually clear it on the server until the undo window passes.
    showUndoToast({
      message: 'Removed from plan.',
      onUndo: restore,
      onConfirm: async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/mealplan/clear', { day, slot });
          setPlan(response.data);
        } catch (err) {
          console.error('Failed to clear slot:', err);
          toast.error('Could not remove — it has been restored.');
          restore();
        }
      },
    });
  };

  if (loading) return <LoadingSpinner text="Loading meal plan..." />;
  if (!plan) return <p className="text-center text-ink/50 mt-8">Could not load meal plan.</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="font-typewriter text-2xl mb-5">Weekly Meal Plan</h2>

      <div className="bg-[#F7F0DD] border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)] p-4 overflow-x-auto">
        <div className="grid grid-cols-8 gap-px bg-gingham/40 min-w-[700px]">
          <div className="bg-[#F7F0DD]"></div>
          {plan.days.map((d) => (
            <div key={d.day} className="bg-[#E8D9A8]/50 font-typewriter text-xs uppercase tracking-wide text-center py-2">
              {d.day.slice(0, 3)}
            </div>
          ))}

          {SLOTS.map((slot) => (
            <>
              <div key={slot} className="bg-[#E8D9A8]/50 font-typewriter text-xs uppercase tracking-wide flex items-center px-2 capitalize">
                {slot}
              </div>
              {plan.days.map((d) => (
                <div
                  key={d.day + slot}
                  onClick={() => setPickerTarget({ day: d.day, slot })}
                  className="relative bg-[#F7F0DD] p-2 min-h-[70px] text-xs cursor-pointer hover:bg-[#E8D9A8]/40 active:scale-[0.97] transition-all font-sans"
                >
                  {d[slot]?.recipe ? (
                    <>
                      <button
                        onClick={(e) => handleClear(e, d.day, slot)}
                        className="absolute top-1 right-1 text-ink/30 hover:text-gingham text-sm leading-none active:scale-90 transition-transform"
                        title="Remove"
                      >
                        ×
                      </button>
                      <span className="font-handwritten text-sm leading-tight pr-3 block">{d[slot].recipe.title}</span>
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
          <div className="bg-[#F7F0DD] border-2 border-kraft rounded-sm shadow-[5px_5px_0_rgba(59,46,34,0.2)] p-5 max-w-sm w-full max-h-[70vh] overflow-y-auto">
            <h3 className="font-typewriter text-lg mb-3 border-b border-dashed border-kraft pb-2">
              {pickerTarget.day} — {pickerTarget.slot}
            </h3>
            {savedRecipes.map((r) => (
              <div
                key={r._id}
                onClick={() => handleAssign(r._id)}
                className="py-2 border-b border-kraft/20 cursor-pointer hover:bg-[#E8D9A8]/40 active:scale-[0.98] transition-all font-handwritten text-lg"
              >
                {r.title}
              </div>
            ))}
            <button
              onClick={() => setPickerTarget(null)}
              className="mt-4 font-sans text-sm text-ink/50 hover:text-ink active:scale-95 transition-transform"
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