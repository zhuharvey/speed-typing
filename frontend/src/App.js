import React, { useEffect, useState } from 'react';
import Word from './components/Word';
import Timer from './components/Timer';
import wordsData from './words/English.json'

import './App.css';

function App() {

  // in what cases do you need to use [] and in what cases do you not need to?
  const [userInput, setUserInput] = useState('')
  const [rows, setRows] = useState([]) // array of word rows
  const [currentRowIndex, setCurrentRowIndex] = useState(0) // index of current row
  const [currentWordIndex, setCurrentWordIndex] = useState(0) // index of current word in current row  
  const [startCounting, setStartCounting] = useState(false); // state to start the timer
  const [isTestOver, setIsTestOver] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30); // default set to 30 seconds
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  
  const [previousWords, setPreviousWords] = useState([]); // state to hold history of previous words
  const [totalChars, setTotalChars] = useState(0)
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [missingChars, setMissingChars] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const[wordCount, setWordCount] = useState(0);

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
    initializeRows();
  }, []);

  const initializeRows = () => {
    setRows([generateRow(), generateRow()]);
  };

  const generateRow = () => {
    return Array.from({ length: 10 }, () => getRandomWord());
  };

  const getRandomWord = () => {
    return wordsData.words[Math.floor(Math.random() * wordsData.words.length)];
  };

  const handleTimeLimitChange = (event) => {
    const newTimeLimit = parseInt(event.target.value, 10);
    setTimeLimit(newTimeLimit);
    setTimeLeft(newTimeLimit);
    setStartCounting(false);
  };

  // TODO: will be changed in the future to accomodate dynamic row length
  const rowLength = 10;

  const calculateGlobalIndex = (rowIndex, wordIndex) => {
    return rowIndex * rowLength + wordIndex;
  }

  const handleUserInput = (inputValue) => {
    // check if test has ended, if so do nothing
    if(isTestOver) return;

    // Start the timer as soon as the user starts typing
    if (!startCounting) setStartCounting(true);

    setUserInput(inputValue);

    setTotalChars((prev) => prev + inputValue.length - userInput.length);

    // check if the last character is a space and that there's more than just spaces
    if(inputValue.endsWith(' ') && inputValue.trim() !== '') {
      const currentWords = rows[currentRowIndex]
      const currentWord = currentWords[currentWordIndex]
      const typedWord = inputValue.trim()
      const maxLen = Math.max(currentWord.length, typedWord.length)

      // determine correctness based on if the full typed word matches the current word
      const isCorrect = typedWord === currentWord;

      let tempCorrect = 0, tempIncorrect = 0, tempExtra = 0, tempMissing = 0

      for (let i = 0; i < maxLen; i++) {
        if (i < typedWord.length && i < currentWord.length) {
          if (typedWord[i] === currentWord[i]) {
            tempCorrect++;
          } else {
            tempIncorrect++;
          }
        } else if (i >= typedWord.length) {
          tempMissing++;
        } else if (i >= currentWord.length) {
          tempExtra++;
        }
      }

      // if word is correct and a space is pressed, include the space as a correct character
      if (typedWord === currentWord) tempCorrect++;

      // Update character states
      setCorrectChars((prev) => prev + tempCorrect)
      setIncorrectChars((prev) => prev + tempIncorrect)
      setMissingChars((prev) => prev + tempMissing)
      setExtraChars((prev) => prev + tempExtra)

      // Update previousWords state
      setPreviousWords(prev => [...prev, {
        index: wordCount,
        word: currentWord,
        correct: isCorrect,
        details: {
            correct: tempCorrect,
            incorrect: tempIncorrect,
            missing: tempMissing,
            extra: tempExtra
        }
      }]);

      setWordCount(wordCount + 1);

      if (currentWordIndex === currentWords.length - 1) {
        if (currentRowIndex < rows.length - 1) {
          setCurrentRowIndex(currentRowIndex + 1);
        } else {
          setIsTestOver(true);
          setStartCounting(false);
        }
        setCurrentWordIndex(0);
        setRows((prevRows) => [...prevRows.slice(1), generateRow()]);
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
      }

      setUserInput('');
    }
  };


  return (
    <div>
      <h1>Typing Test</h1>
      <Timer 
      startCounting={startCounting}
      timeLeft={timeLeft} 
      setTimeLeft={setTimeLeft}
      correctChars={correctChars}
      totalChars={totalChars}
      />
      <select onChange={handleTimeLimitChange} value={timeLimit}>
        <option value={10}>10 seconds</option>
        <option value={15}>15 seconds</option>
        <option value={30}>30 seconds</option>
      </select>
      <div className='typing-area'>
        {rows.map((rowWords, idx) => (
          <div key={idx} className="word-row">
            {rowWords.map((word, wordIdx) => {
              // calculate a unique index for each word
              let globalWordIndex = calculateGlobalIndex(idx, wordIdx);
              return (
                <Word
                  key={wordIdx}
                  text={word}
                  active={idx === currentRowIndex && wordIdx === currentWordIndex}
                  correct={previousWords.find(p => p.index === globalWordIndex)?.correct}
                />
              );
            })}
          </div>
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

