import React, { useEffect, useState } from 'react';

function Timer({ startCounting, correctChars, totalChars }) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
      let id;
      if (startCounting) {
          id = setInterval(() => {
              setTimeElapsed(oldTime => oldTime + 1);
          }, 1000);
      }
      return () => clearInterval(id);
  }, [startCounting]);

  const minutes = timeElapsed / 60 || 1; // Avoid division by zero
  const wpm = (correctChars / 5) / minutes;
  const rawScore = (totalChars / 5) / minutes; // total characters typed

  return (
      <div>
          <p>Time: {timeElapsed} seconds</p>
          <p>WPM: {isFinite(wpm) ? wpm.toFixed(2) : 0}</p>
          <p>Raw Score: {isFinite(rawScore) ? rawScore.toFixed(2) : 0}</p>
      </div>
  );
}

export default Timer;
