import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const response = await api.post(endpoint, { email, password });

      login(response.data.token, response.data.email);
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!');
      navigate('/saved');
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <div className="bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.15)] p-6">
        <h2 className="font-typewriter text-2xl mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="text-sm text-ink/60 font-sans mb-5">
          {mode === 'login'
            ? 'Log in to see your saved recipes and meal plan.'
            : 'Save recipes and build your weekly plan.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block font-typewriter text-xs uppercase tracking-wide text-ink/70 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-kraft bg-card-alt/40 rounded-sm p-2 font-sans mb-4"
          />

          <label className="block font-typewriter text-xs uppercase tracking-wide text-ink/70 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-kraft bg-card-alt/40 rounded-sm p-2 font-sans mb-5"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gingham text-card font-typewriter py-2.5 rounded-sm hover:bg-gingham-dark active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-ink/60 font-sans mt-4 text-center">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-gingham font-medium hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>

      <Link
        to="/"
        className="block text-center font-typewriter text-sm text-ink/50 hover:text-ink mt-4"
      >
        ← Continue as guest
      </Link>
    </div>
  );
};

export default AuthPage;