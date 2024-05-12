import React, { useEffect, useState } from 'react';
import fetchWords from './services/WordService';
import Word from './components/Word';
import Timer from './components/Timer';
import PreviousWords from './components/PreviousWords'

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
  const [previousWords, setPreviousWords] = useState([]) // state to hold history of previous words
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

    // console.log(wordBox)
    // console.log(wordBox[currentWordIndex])
    // console.log(previousWords)
    // console.log(currentWordIndex)

    // Update user input
    setUserInput(inputValue);

    if (typeof inputValue !== 'string') {
      console.error('Expected string for inputValue but received:', typeof inputValue);
      return;  // Optionally exit the function if the type is incorrect
    }

    // check if the last character is a space and that there's more than just spaces
    if(inputValue.endsWith(' ') && inputValue.trim() !== '') {
      const wordsTyped = inputValue.trim()
      const currentWord = wordBox[currentWordIndex]
      const isCorrect = currentWord === wordsTyped

      // console.log(wordsTyped)
      // console.log(currentWord)

      // Update the previous words state with the current word and its correctness
      setPreviousWords(prev => [...prev, { word: currentWord, correct: isCorrect }])

      if (currentWordIndex === wordBox.length - 1) {
        setIsTestOver(true);
        setStartCounting(false);
      } else {
        setCurrentWordIndex(index => index + 1);
      }

      setUserInput(''); // clear input field
    
    }


    // // array to hold correctness state for each character
    // const newCorrectChars = wordBox.map((word, index) => {
    //   if(index < currentWordIndex) {
    //     return correctChars[index]
    //   } else {
    //     // for current and future words, recalculate the correctness
    //     const typedWord = inputValue.trim().split(' ')[index] || ''
    //     return word.split('').map((char, charIndex) => {
    //       return charIndex < typedWord.length ? char === typedWord[charIndex] : null;
    //     })
    //   }
    // })

    //  update correctness state
    // setCorrectChars(newCorrectChars)
    // console.log(newCorrectChars)

    // // check if user has finished typing the current word
    // if (inputValue.endsWith(' ') && inputValue.trim() !== '') {
    //   // Move to the next word or finish the test if this is the last word.
    //   if (currentWordIndex === wordBox.length - 1) {
    //     setIsTestOver(true);
    //     setStartCounting(false);
    //   } else {
    //     setCurrentWordIndex(currentIndex => currentIndex + 1);
    //   }
    //   setUserInput(''); // Clear the input field ready for the next word.
    // }


  };

  return (
    <div>
      <h1>Typing Test</h1>
      <Timer 
          startCounting={startCounting} 
          correctWords={previousWords.filter(w => w.correct).length} 
      />

      <PreviousWords 
          words={previousWords} 
      /> {/* Display the previous words */}

      <div className='typing-area'>
      {wordBox.map((word, index) => (
          <Word
              key={index}
              text={word}
              active={index === currentWordIndex}
              correct={previousWords[index]?.correct}  // Pass the correct status from previousWords state
          />
      ))}
      </div>
      <input
          placeholder={isTestOver ? 'Test over, click to restart' : 'Start typing...'}
          type="text"
          value={userInput}
          onChange={(e) => handleUserInput(e.target.value)}
          autoFocus
          disabled={isTestOver}
      />
      {isTestOver && (
        <div>
          <p>Test over, click to restart</p>
          <button onClick={() => window.location.reload()}>Restart Test</button>
        </div>
      )}
    </div>
  );
}

export default App;

