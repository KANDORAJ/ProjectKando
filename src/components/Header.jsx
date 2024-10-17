import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>Task Manager</h1>
      <nav>
        <ul>
          <li><Link to="/">Main Page</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/game">Game</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;