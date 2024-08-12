import React from "react";

function Word({ text, active, correct }) {
  const safeText = text || ""; 
  
  // Ensuring that the correct and incorrect classes are only applied after evaluation
  const wordClasses = `word ${active ? "active" : ""} ${
    correct === true ? "correct" : correct === false ? "incorrect" : ""
  }`;

  return (
    <span className={wordClasses}>
      {safeText.split('').map((char, index) => {
        let className = '';
        if (correct === true) {
          className = 'correct';
        } else if (correct === false) {
          className = 'incorrect';
        }
        return (
          <span key={`${safeText}-${index}`} className={className}>
            {char}
          </span>
        );
      })}
    </span>
  );
}

export default React.memo(Word);
