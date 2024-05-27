import React, { useEffect, useState } from 'react';

function Timer({ startCounting, correctChars, totalChars, timeLeft, setTimeLeft }) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let id;
    if (startCounting && timeLeft > 0) {
      id = setInterval(() => {
        setTimeElapsed(oldTime => oldTime + 1);
        setTimeLeft(prevTime => prevTime - 1); // Decrement the remaining time
      }, 1000);
    } else if (timeLeft <= 0) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [startCounting, timeLeft]);

  const minutes = timeElapsed / 60 || 1; // Avoid division by zero
  const wpm = (correctChars / 5) / minutes;
  const rawScore = (totalChars / 5) / minutes; // Total characters typed

  return (
    <div>
      <p>Time: {timeLeft} seconds</p> {/* Display remaining time instead of elapsed time */}
      <p>WPM: {isFinite(wpm) ? wpm.toFixed(2) : 0}</p>
      <p>Raw Score: {isFinite(rawScore) ? rawScore.toFixed(2) : 0}</p>
    </div>
  );
}

export default Timer;
