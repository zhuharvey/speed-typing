import React, { useEffect, useState } from 'react';
import fetchWords from './services/WordService';
import Word from './components/Word';
import Timer from './components/Timer';
import wordsData from './words/English.json'

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
  
  const [totalChars, setTotalChars] = useState(0)
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [missingChars, setMissingChars] = useState(0);
  const [extraChars, setExtraChars] = useState(0);

  const [timeLimit, setTimeLimit] = useState(30) // default set to 30 seconds
  const [timeLeft, setTimeLeft] = useState(timeLimit)

  useEffect(() => {
      let timer = null;
      if (startCounting && timeLeft > 0) {
          timer = setTimeout(() => {
              setTimeLeft(timeLeft - 1);
          }, 1000);
      } else if (timeLeft === 0) {
          setIsTestOver(true);
          setStartCounting(false);
      }
      return () => clearTimeout(timer);
  }, [startCounting, timeLeft]);


  useEffect(() => {
    setWordBox(shuffleArray([...wordsData.words]));
  }, []);

  function handleTimeLimitChange(event) {
    const newTimeLimit = parseInt(event.target.value, 10);
    setTimeLimit(newTimeLimit);
    setTimeLeft(newTimeLimit);
  }

  function getRandomWord() {
    return wordsData.words[Math.floor(Math.random() * wordsData.words.length)];
  }

  // function to initially shuffle the word box
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  const handleUserInput = (inputValue) => {
    // check if test has ended, if so do nothing
    if(isTestOver) return;

    // Start the timer as soon as the user starts typing
    if (!startCounting) {
      setStartCounting(true);
    }

    setUserInput(inputValue);

    // makes it so that backspace isn't counted as a character
    // total chars is calculated with every keystroke -> might be inefficient
    setTotalChars((prev) => prev + inputValue.length - userInput.length)

    // check if the last character is a space and that there's more than just spaces
    if(inputValue.endsWith(' ') && inputValue.trim() !== '') {
      const currentWord = wordBox[currentWordIndex]
      const typedWord = inputValue.trim()
      const maxLen = Math.max(currentWord.length, typedWord.length)

      let tempCorrect = 0
      let tempIncorrect = 0
      let tempExtra = 0
      let tempMissing = 0

      for (let i = 0; i < maxLen; i++) {
        if (i < typedWord.length && i < currentWord.length) {
            if (typedWord[i] === currentWord[i]) {
                tempCorrect++
            } else {
                tempIncorrect++
            }
        } else if (i >= typedWord.length) {
            tempMissing++
        } else if (i >= currentWord.length) {
            tempExtra++
        }
      }

      // if word is correct and a space is pressed, include the space as a correct character
      if (typedWord === currentWord) {
        tempCorrect++
      }

      // set character states
      setCorrectChars((prev) => prev + tempCorrect);
      setIncorrectChars((prev) => prev + tempIncorrect);
      setExtraChars((prev) => prev + tempExtra);
      setMissingChars((prev) => prev + tempMissing);

      // determine is word is correct
      const isCorrect = typedWord === currentWord;

      // Update the previous words state with detailed information
      setPreviousWords(prev => [...prev, {
        word: currentWord + ' ',
        correct: isCorrect,
        details: {
            correct: tempCorrect,
            incorrect: tempIncorrect,
            missing: tempMissing,
            extra: tempExtra
        }
    }]);

    if (!isTestOver) {
      setCurrentWordIndex(currentWordIndex + 1)
      setWordBox([...wordBox, getRandomWord()])
    }

    setUserInput('')


    // if (currentWordIndex === wordBox.length - 1) {
    //   setIsTestOver(true);
    //   setStartCounting(false);
    // } else {
    //     setCurrentWordIndex(index => index + 1);
    // }
    // setUserInput('');
    
    }


  };

  return (
    <div>
      <h1>Typing Test</h1>
      <Timer 
          startCounting={startCounting}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          missingChars={missingChars}
          extraChars={extraChars}
          totalChars={totalChars}
      />

      <p>Time left: {timeLeft} seconds</p>

      <select onChange={handleTimeLimitChange} value={timeLimit}>
          <option value={10}>10 seconds</option>
          <option value={15}>15 seconds</option>
          <option value={30}>30 seconds</option>
      </select>

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

