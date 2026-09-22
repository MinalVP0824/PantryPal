import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: '/generate', label: 'Generate' },
    { to: '/saved', label: 'Saved Recipes' },
    { to: '/planner', label: 'Meal Planner' },
    { to: '/grocery-list', label: 'Grocery List' },
  ];

  return (
    <nav className="border-b-2 border-kraft bg-[#E8D9A8]/40 px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6">
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
    </nav>
  );
};

export default Navbar;