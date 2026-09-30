import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LemonDoodle } from './Doodles';
import LoadingSpinner from './LoadingSpinner';

const GroceryList = () => {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchList();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchList = async () => {
    try {
      const response = await api.get('/api/grocery-list');
      setItems(response.data);
    } catch (err) {
      console.error('Failed to fetch grocery list:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchList();
  };

  const toggleChecked = (index) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="font-typewriter text-3xl mb-1">Grocery List</h2>
        <div className="flex flex-col items-center text-center py-16 bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)] mt-4">
          <div className="opacity-40">
            <LemonDoodle size={110} />
          </div>
          <p className="text-ink/50 font-handwritten text-xl mt-3">Log in to see your grocery list.</p>
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

  if (loading) return <LoadingSpinner text="Loading grocery list..." />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-typewriter text-3xl">Grocery List</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="font-typewriter text-sm bg-card-alt border border-kraft px-4 py-2 rounded-sm hover:bg-kraft/30 active:scale-95 transition-all disabled:opacity-50"
        >
          {refreshing ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>
      <p className="text-ink/60 text-base mb-6 font-sans">
        {items.length} item{items.length !== 1 ? 's' : ''} to pick up
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)]">
          <div className="opacity-40">
            <LemonDoodle size={110} />
          </div>
          <p className="text-ink/50 font-handwritten text-xl mt-3">Nothing to pick up yet.</p>
          <button
            onClick={() => navigate('/planner')}
            className="inline-block bg-gingham text-card font-typewriter text-base px-5 py-2.5 mt-5 rounded-sm hover:bg-gingham-dark active:scale-95 transition-all"
          >
            Plan some meals →
          </button>
        </div>
      ) : (
        <div className="bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)] p-8 -rotate-[0.3deg]">
          <ul className="divide-y divide-dashed divide-kraft/40">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-4 py-3">
                <input
                  type="checkbox"
                  checked={!!checked[index]}
                  onChange={() => toggleChecked(index)}
                  className="accent-gingham w-5 h-5"
                />
                <span className={checked[index] ? 'line-through text-ink/30' : ''}>
                  <span className="font-handwritten text-xl">{item.name}</span>
                  <span className="text-sm text-ink/40 ml-1.5 font-sans">
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