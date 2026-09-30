import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, email, logout } = useAuth();

  const links = [
    { to: '/generate', label: 'Generate' },
    { to: '/saved', label: 'Saved Recipes' },
    { to: '/planner', label: 'Meal Planner' },
    { to: '/grocery-list', label: 'Grocery List' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b-2 border-kraft bg-card-alt/40 px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6">
      <Link to="/" className="flex items-center gap-2">
        <Logo size={32} />
        <span className="font-typewriter text-base sm:text-lg tracking-wide">PantryPal</span>
      </Link>
      <div className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-5 font-typewriter text-xs sm:text-sm">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`pb-1 border-b-2 transition-colors ${
              location.pathname === link.to
                ? 'border-gingham text-gingham'
                : 'border-transparent hover:border-kraft'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <span className="font-sans text-xs text-ink/60 hidden sm:inline">{email}</span>
            <button
              onClick={handleLogout}
              className="font-typewriter text-xs bg-card-alt border border-kraft px-3 py-1.5 rounded-sm hover:bg-kraft/30 active:scale-95 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="font-typewriter text-xs bg-gingham text-card px-3 py-1.5 rounded-sm hover:bg-gingham-dark active:scale-95 transition-all"
          >
            Log In
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;