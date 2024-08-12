import React from 'react';
import Word from './Word';

const SpeedTestArea = ({ rows, handleUserInput, userInput, isTestOver, getCorrectValue, previousWords }) => {
  return (
    <div className='typing-area'>
      {rows.map((rowWords, idx) => (
        <div key={idx} className="word-row">
          {rowWords.map((word, wordIdx) => {
            return (
              <Word
                key={`${idx}-${wordIdx}`} // Ensure key uniqueness
                text={word}
                active={idx === 0 && wordIdx === previousWords.length} // Adjust based on your active word logic
                correct={getCorrectValue(previousWords, idx, wordIdx, null)}  // Pass the correct status from previousWords state
              />
            );
          })}
        </div>
      ))}
      <input
        placeholder={isTestOver ? 'Test over, click to restart' : 'Start typing...'}
        type="text"
        value={userInput}
        onChange={(e) => handleUserInput(e.target.value)}
        autoFocus
        disabled={isTestOver}
      />
    </div>
  );
};

export default SpeedTestArea;
