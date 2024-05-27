import React from "react";

function Word({ text, active, correct }) {
  // Ensuring that the correct and incorrect classes are only applied after evaluation
  const wordClasses = `word ${active ? "active" : ""} ${
    correct === true ? "correct" : correct === false ? "incorrect" : ""
  }`;


  return (
    <span className={wordClasses}>
      {text.split('').map((char, index) => {
        // Only apply the specific character class if the word has been fully evaluated
        let className = '';
        if (correct === true) {
          className = 'correct';
        } else if (correct === false) {
          className = 'incorrect';
        }
        return (
          <span key={`${text}-${index}`} className={className}>
            {char}
          </span>
        );
      })}
    </span>
  );
}

export default React.memo(Word);
