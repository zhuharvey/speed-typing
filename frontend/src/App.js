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
  const [rows, setRows] = useState([]) // array of word rows
  const [currentRow, setCurrentRow] = useState(0) // index of current top row
  
  const [startCounting, setStartCounting] = useState(false)
  const [previousWords, setPreviousWords] = useState([]) // state to hold history of previous words
  const [isTestOver, setIsTestOver] = useState(false)
  
  // const [totalChars, setTotalChars] = useState(0)
  // const [correctChars, setCorrectChars] = useState(0);
  // const [incorrectChars, setIncorrectChars] = useState(0);
  // const [missingChars, setMissingChars] = useState(0);
  // const [extraChars, setExtraChars] = useState(0);

  const [timeLimit, setTimeLimit] = useState(30) // default set to 30 seconds
  const [timeLeft, setTimeLeft] = useState(timeLimit)

  console.log(rows)

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
    const newRows = []
    let tempRow = []

    wordsData.words.forEach((word, index) => {
      tempRow.push(word)
      // example: break into new row every 10 words
      if (tempRow.length === 10 || index === wordsData.words.length - 1) {
        newRows.push(tempRow)
        tempRow = []
      }
  })

  setRows(newRows)
}, [])

  function handleTimeLimitChange(event) {
    const newTimeLimit = parseInt(event.target.value, 10);
    setTimeLimit(newTimeLimit);
    setTimeLeft(newTimeLimit);
  }

  const handleUserInput = (inputValue) => {
    // check if test has ended, if so do nothing
    if(isTestOver) return;

    // Start the timer as soon as the user starts typing
    if (!startCounting) {
      setStartCounting(true);
    }

    setUserInput(inputValue);

    // check if the last character is a space and that there's more than just spaces
    if(inputValue.endsWith(' ') && inputValue.trim() !== '') {
      const currentWords = rows[currentRow]
      const wordIndex = currentWords.findIndex(word => userInput.trim() === word)
      const currentWord = currentWords[wordIndex]
      const isEndOfRow = wordIndex === currentWords.length - 1

      let correct = inputValue.trim() === currentWord

      setPreviousWords(prev => [...prev, { word: currentWord, correct }])
      setUserInput('')

      if (isEndOfRow) {
        // move to the next row
        if (currentRow < rows.length - 1) {
          setCurrentRow(currentRow + 1)
        } else {
          setIsTestOver(true)
        }
      } else {
        setCurrentRow(wordIndex + 1)
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
          timeLeft={timeLeft}
      />

      <p>Time left: {timeLeft} seconds</p>

      <select onChange={handleTimeLimitChange} value={timeLimit}>
          <option value={10}>10 seconds</option>
          <option value={15}>15 seconds</option>
          <option value={30}>30 seconds</option>
      </select>

      <div className='typing-area'>
        {rows.slice(currentRow, currentRow + 2).map((rowWords, idx) => (
          <div key={idx} className="word-row">
            {rowWords.map((word, wordIdx) => (
              <Word
                key={wordIdx}
                text={word}
                active={idx === 0 && wordIdx === currentRow} // Adjust based on your active word logic
                correct={previousWords.find(p => p.word === word)?.correct}
              />
            ))}
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

