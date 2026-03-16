import { createContext, useState, useEffect } from 'react';
import { api } from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('travel_diary_token');
    const savedUser = localStorage.getItem('travel_diary_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('travel_diary_token');
        localStorage.removeItem('travel_diary_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('travel_diary_token', data.token);
    localStorage.setItem('travel_diary_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const signup = async (username, email, password) => {
    const data = await api.signup({ username, email, password });
    localStorage.setItem('travel_diary_token', data.token);
    localStorage.setItem('travel_diary_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('travel_diary_token');
    localStorage.removeItem('travel_diary_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
