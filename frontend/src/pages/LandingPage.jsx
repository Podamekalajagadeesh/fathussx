import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <h1>Welcome to the Learning Platform</h1>
        <p>Your journey to mastery starts here.</p>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
      </header>
    </div>
  );
};

export default LandingPage;