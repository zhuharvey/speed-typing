import React, { useEffect, useState } from 'react';
import fetchWords from './services/WordService';
import Word from './components/Word';
import Timer from './components/Timer';

import './App.css';

// // TODO: Update word box and put all text / words into a different file
// const getWordBox = () => 'random words to test hello keep typing a couple more okay banana elon musk quote of the day'.split(' ')
// //.sort(() => Math.random() > 0.5 ? 1 : -1)

function App() {

  // in what cases do you need to use [] and in what cases do you not need to?
  const [userInput, setUserInput] = useState('')
  const [wordBox, setWordBox] = useState([])
  const [startCounting, setStartCounting] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [correctChars, setCorrectChars] = useState([])
  const [isTestOver, setIsTestOver] = useState(false)

  useEffect(() => {
    fetchWords().then(words => {
      setWordBox(words.split(' '));
    })
  }, [])

  const handleUserInput = (inputValue) => {
    // check if test has ended, if so do nothing
    if(isTestOver) return;

    // Start the timer as soon as the user starts typing
    if (!startCounting) {
      setStartCounting(true);
    }

    // Update user input
    setUserInput(inputValue);

    // array to hold correctness state for each character
    const newCorrectChars = wordBox.map((word, index) => {
      if(index < currentWordIndex) {
        return correctChars[index]
      } else {
        // for current and future words, recalculate the correctness
        const typedWord = inputValue.trim().split(' ')[index] || ''
        return word.split('').map((char, charIndex) => {
          return charIndex < typedWord.length ? char === typedWord[charIndex] : null;
        })
      }
    })

    //  update correctness state
    setCorrectChars(newCorrectChars)
    console.log(newCorrectChars)

    // check if user has finished typing the current word
    if (inputValue.endsWith(' ') && inputValue.trim() !== '') {
      // Move to the next word or finish the test if this is the last word.
      if (currentWordIndex === wordBox.length - 1) {
        setIsTestOver(true);
        setStartCounting(false);
      } else {
        setCurrentWordIndex(currentIndex => currentIndex + 1);
      }
      setUserInput(''); // Clear the input field ready for the next word.
    }


  };

  return (
    <div>
      <h1>Typing Test</h1>

      <Timer 
          startCounting={startCounting}
          correctWords={wordBox.slice(0, currentWordIndex).join(' ').length}
      />

      <div className='typing-area'>
      {wordBox.map((word, index) => (
          <Word 
              key={index}
              text={word}
              active={index === currentWordIndex}
              correct={correctChars[index]}
              />

      ))}
      </div>

      <input 
          placeholder={isTestOver ? 'Test over, click to restart' : 'Start typing...'}
          type="text" 
          value={userInput} 
          onChange={(e) => handleUserInput(e.target.value)}
          autoFocus
          disabled={isTestOver} // Disable input when test is over
        />

      {isTestOver && (
        <div>
          <p>Test over, click to restart</p>
        <button onClick={() => window.location.reload(false)}>Restart Test</button>
        </div>
      )}
    </div>
  )
}

export default App;
