import React from 'react';

const RestartComponent = ({ isTestOver }) => {
  if (!isTestOver) {
    return null;
  }

  return (
    <div>
      <p>Test over, click to restart</p>
      <button onClick={() => window.location.reload()}>Restart Test</button>
    </div>
  );
};

export default RestartComponent;
