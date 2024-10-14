import React from 'react';
import MyCalendar from '../components/Calendar';

function About() {
  return (
    <div className="container">
      <h2>About</h2>
      <p>This app was developed to help you manage your tasks.</p>
      <p>Made By <a href="https://github.com/KANDORAJ" target="_blank" rel="noopener noreferrer">KANDORAJ</a></p>
      <div>
      <MyCalendar />
    </div>
    </div>
  );
}

export default About;