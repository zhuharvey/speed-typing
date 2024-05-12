import React from 'react';

function PreviousWords({ words }) {
  return (
    <div>
      <h2>Previous Words</h2>
      <ul>
        {words.map((item, index) => (
          <li key={index}>
            {item.word}: {item.correct ? 'Correct' : 'Incorrect'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PreviousWords;