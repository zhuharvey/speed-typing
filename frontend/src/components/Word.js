import React from "react";

function Word({ text, active, correct }) {
    // Render each character in the word as a span
    // This allows for individual characters to be styled as correct/incorrect
    console.log(text, correct)
    return (
      <span className={active ? "active" : ""}>
        {text.split('').map((char, index) => {
          let className = '';
          if (correct === true) {
            className = 'correct';
          } else if (correct === false) {
            className = 'incorrect';
          }

          // Append active class only if the word is currently being typed
          if (active) {
            className += ' active';
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
