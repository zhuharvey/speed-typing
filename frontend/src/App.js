import React, { useEffect, useRef, useState } from 'react';
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
  const [correctWordArray, setCorrectWordArray] = useState([])

  useEffect(() => {
    fetchWords().then(words => {
      setWordBox(words);
    })
  }, [])

  function updateUserInput(value) {
    // TODO: Restart button
    // Add a word count and a timer ( to get speed and whatnot )

    if(currentWordIndex === wordBox.length) {
      return
    }

    if(!startCounting) {
      setStartCounting(true)
    }

    if(value.endsWith(' ')) {
      
      if(currentWordIndex === wordBox.length - 1) {
        // overflow
        setStartCounting(false)
        setUserInput('Completed')
      } else {
        setUserInput('')
      }

      // user has finished the word -- check if it is equal
      setCurrentWordIndex(index => index + 1)

      // checking for the correct word
      setCorrectWordArray(data => {
        const word = value.trim()
        const newResult = [...data]
        newResult[currentWordIndex] = word === wordBox[currentWordIndex]
        return newResult
      })

    } else {
      setUserInput(value)
    }
  }

  return (
    <div>
      <h1>Typing Test</h1>

      <Timer 
          startCounting={startCounting}
          correctWords={correctWordArray.filter(Boolean).length}
      />

      <p>{wordBox.map((word, index) => {
        
          return <Word 
                  text={word}
                  active={index === currentWordIndex}
                  correct={correctWordArray[index]}
                  />

      })}</p>
      <input 
          placeholder='Start typing...'
          type="text" 
          value={userInput} 
          onChange={(e) => updateUserInput(e.target.value)}
        />
    </div>
  )
}

export default App;
