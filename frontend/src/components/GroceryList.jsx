import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LemonDoodle } from './Doodles';
import LoadingSpinner from './LoadingSpinner';

const GroceryList = () => {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchList();

    // The list is computed from whatever's currently in the meal plan, so if
    // the person switches to another tab (e.g. to plan more meals) and comes
    // back, quietly refetch instead of showing a stale list.
    const handleFocus = () => fetchList({ silent: true });
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchList = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    try {
      const response = await axios.get('http://localhost:5000/api/grocery-list');
      setItems(response.data);
    } catch (err) {
      console.error('Failed to fetch grocery list:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleChecked = (index) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) return <LoadingSpinner text="Loading grocery list..." />;
  return (
    <div className="max-w-md mx-auto">
      <h2 className="font-typewriter text-2xl mb-1">Grocery List</h2>
      <div className="flex items-center justify-between mb-5">
        <p className="text-ink/60 text-sm font-sans">
          {items.length} item{items.length !== 1 ? 's' : ''} to pick up
        </p>
        <button
          onClick={() => fetchList({ silent: true })}
          disabled={refreshing}
          className="flex items-center gap-1.5 bg-gingham text-[#F7F0DD] rounded-sm px-2.5 py-1 hover:bg-[#8f3630] font-typewriter text-xs uppercase tracking-wide active:scale-95 transition-all disabled:opacity-50"
          title="Refresh list"
        >
          <span className={refreshing ? 'inline-block animate-spin-slow' : 'inline-block'}>↻</span>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center text-center py-12 bg-[#F7F0DD] border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)]">
          <div className="opacity-40">
            <LemonDoodle size={90} />
          </div>
          <p className="text-ink/50 font-handwritten text-lg mt-2">Nothing to pick up yet.</p>
          <Link
            to="/planner"
            className="inline-block bg-gingham text-[#F7F0DD] font-typewriter text-sm px-4 py-2 mt-4 rounded-sm hover:bg-[#8f3630] transition-colors"
          >
            Plan some meals →
          </Link>
        </div>
      ) : (
        <div className="bg-[#F7F0DD] border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)] p-5 -rotate-[0.3deg]">
          <ul className="divide-y divide-dashed divide-kraft/40">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={!!checked[index]}
                  onChange={() => toggleChecked(index)}
                  className="accent-gingham w-4 h-4"
                />
                <span className={checked[index] ? 'line-through text-ink/30' : ''}>
                  <span className="font-handwritten text-lg">{item.name}</span>
                  <span className="text-xs text-ink/40 ml-1 font-sans">
                    ({item.amount} {item.unit})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GroceryList;