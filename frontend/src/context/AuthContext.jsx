/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import api from '../api';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/api/profile/me', {
            headers: { 'x-auth-token': token },
          });
          setUser(res.data);
          localStorage.setItem('token', token);
        } catch (err) {
          console.error('Failed to fetch user', err);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
    };
    fetchUser();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const authValue = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

export { AuthProvider };