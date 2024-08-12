import React, { useState } from 'react';
import Timer from './Timer';

const TimerComponent = ({ startCounting, timeLeft, setTimeLeft, correctChars, totalChars }) => {
  const [timeLimit, setTimeLimit] = useState(30);

  const handleTimeLimitChange = (event) => {
    const newTimeLimit = parseInt(event.target.value, 10);
    setTimeLimit(newTimeLimit);
    setTimeLeft(newTimeLimit);
    // Optionally reset or stop the timer here if needed
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
      <select onChange={handleTimeLimitChange} value={timeLimit}>
        <option value={10}>10 seconds</option>
        <option value={15}>15 seconds</option>
        <option value={30}>30 seconds</option>
      </select>
    </div>
  );
};

export default TimerComponent;
