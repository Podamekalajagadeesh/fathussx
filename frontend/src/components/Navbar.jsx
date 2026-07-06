import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Notifications from './Notifications';
import './Navbar.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ULE
        </Link>

        <button
          className="nav-hamburger"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((s) => !s)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        {token && (
          <form className="search-form" onSubmit={handleSearch} role="search">
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
        )}

        <ul className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
          {token ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-links">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/courses" className="nav-links">Courses</Link>
              </li>
              <li className="nav-item">
                <Link to="/my-courses" className="nav-links">My Courses</Link>
              </li>
              <li className="nav-item">
                <Link to="/playground" className="nav-links">Playground</Link>
              </li>
              <li className="nav-item">
                <Link to="/flashcards" className="nav-links">Flashcards</Link>
              </li>
              <li className="nav-item">
                <Link to="/gigs" className="nav-links">Gigs</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-links">Profile</Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-links">Settings</Link>
              </li>
              <li className="nav-item">
                <Link to="/files" className="nav-links">Files</Link>
              </li>
              {user && user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links">Admin</Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/messages" className="nav-links">Messages</Link>
              </li>
              <li className="nav-item">
                <Notifications />
              </li>
              <li className="nav-item">
                <button
                  className="nav-links-button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links-button">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;