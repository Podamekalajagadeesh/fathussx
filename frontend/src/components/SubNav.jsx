import React from 'react';
import { NavLink } from 'react-router-dom';

const SubNav = ({ links }) => {
  return (
    <nav className="sub-nav">
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <NavLink to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubNav;