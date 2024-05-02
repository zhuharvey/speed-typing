import React from "react";

function Word({ text, active, correct = [] }) {
    // Render each character in the word as a span
    // This allows for individual characters to be styled as correct/incorrect
    console.log(text, correct)
    return (
      <span>
        {text.split('').map((char, index) => {
          let className = '';
          if (active) {
            if (correct[index] === true) {
              className = 'correct';
            } else if (correct[index] === false) {
              className = 'incorrect';
            }
          }
          return (
            <span 
                key={`${text}-${index}`}
                className={className}>{char}
            </span>
          );
        })}
        {' '} {/* Add a space after each word */}
      </span>
    );
  }
  
export default React.memo(Word);