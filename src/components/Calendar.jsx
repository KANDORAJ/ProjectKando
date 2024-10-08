import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar() {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      <h2>Select a Date:</h2>
      <Calendar
        onChange={handleDateChange}
        value={date}
      />
      <p>Selected Date: {date.toDateString()}</p>
    </div>
  );
}

export default MyCalendar;
