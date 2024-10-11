import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const calculateDaysLeft = (date) => {
    const today = new Date();
    const timeDiff = date - today; 
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 
    return daysLeft;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <h1>Calendar Page</h1>
      <p>Select a Date:</p>
      <Calendar onChange={handleDateChange} value={selectedDate} />
      
      <p>Selected Date: {selectedDate.toDateString()}</p>
      
      <p>
        Days until selected date: {calculateDaysLeft(selectedDate)} day(s) left
      </p>
    </div>
  );
};

export default CalendarPage;
