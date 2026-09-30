import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('pantrypal-token');
    const savedEmail = localStorage.getItem('pantrypal-email');
    if (savedToken) {
      setToken(savedToken);
      setEmail(savedEmail);
    }
    setLoading(false);
  }, []);

  const login = (newToken, newEmail) => {
    localStorage.setItem('pantrypal-token', newToken);
    localStorage.setItem('pantrypal-email', newEmail);
    setToken(newToken);
    setEmail(newEmail);
  };

  const logout = () => {
    localStorage.removeItem('pantrypal-token');
    localStorage.removeItem('pantrypal-email');
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, isLoggedIn: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);