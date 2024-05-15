import React from "react";

function Word({ text, active, correct }) {
  const wordClasses = `word ${active ? "active" : ""} ${correct === true ? "correct" : correct === false ? "incorrect" : ""}`;
    return (
      <span className={wordClasses}>
        {text.split('').map((char, index) => {
          let className = '';
          if (correct) {
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
