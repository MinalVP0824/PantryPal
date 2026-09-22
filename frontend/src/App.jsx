import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import DoodleBackground from './components/DoodleBackground';
import Landing from './pages/Landing';
import Home from './pages/Home';
import SavedRecipesPage from './pages/SavedRecipesPage';
import PlannerPage from './pages/PlannerPage';
import GroceryListPage from './pages/GroceryListPage';
import RecipeDetailPage from './pages/RecipeDetailPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app min-h-screen relative">
        <DoodleBackground />
        <div className="relative z-10">
          <Navbar />
          <div className="pt-10 px-4 sm:px-6 md:px-16">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/generate" element={<Home />} />
              <Route path="/saved" element={<SavedRecipesPage />} />
              <Route path="/saved/:id" element={<RecipeDetailPage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/grocery-list" element={<GroceryListPage />} />
            </Routes>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#F7F0DD',
                color: '#3B2E22',
                border: '2px solid #A9835C',
                borderRadius: '2px',
                boxShadow: '4px 4px 0 rgba(59,46,34,0.15)',
                fontFamily: "'Special Elite', monospace",
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: { iconTheme: { primary: '#6B7A4F', secondary: '#F7F0DD' } },
              error: { iconTheme: { primary: '#A8433C', secondary: '#F7F0DD' } },
            }}
          />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;