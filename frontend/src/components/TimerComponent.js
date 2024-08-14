import React, { useEffect, useState } from 'react';
import Timer from './Timer';

function TimerComponent({ startCounting, onTimeExpired, correctChars, totalChars }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30); // Manage dropdown state separately

  useEffect(() => {
    let timerId;
    if (startCounting && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerId);
      onTimeExpired();
    }
    return () => clearInterval(timerId);
  }, [startCounting, timeLeft, onTimeExpired]);

  const handleTimeLimitChange = (event) => {
    const newTimeLimit = parseInt(event.target.value, 10);
    setSelectedTime(newTimeLimit); // Only change selectedTime
    if (!startCounting) {
      setTimeLeft(newTimeLimit); // Only reset timeLeft if not counting
    }
  };

  return (
    <div>
      <Timer
        startCounting={startCounting}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        correctChars={correctChars}
        totalChars={totalChars}
      />
      <select onChange={handleTimeLimitChange} value={selectedTime}>
        <option value={10}>10 seconds</option>
        <option value={15}>15 seconds</option>
        <option value={30}>30 seconds</option>
      </select>
    </div>
  );
}

export default TimerComponent;
