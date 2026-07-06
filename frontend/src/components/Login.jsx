import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../api';
import './Auth.css'; // Import the unified stylesheet

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <div className="auth-container">
      <form className="auth-form card" onSubmit={onSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-auth">Login</button>
        
        <div className="auth-links">
          <p><Link to="/forgot-password">Forgot Password?</Link></p>
          <p>No account yet? <Link to="/register">Sign Up</Link></p>
        </div>

        <div className="social-login">
          <a href={`${backendUrl}/api/auth/google`} className="social-btn">
            {/* Add Google Icon here */}
            Login with Google
          </a>
          <a href={`${backendUrl}/api/auth/github`} className="social-btn">
            {/* Add GitHub Icon here */}
            Login with GitHub
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;