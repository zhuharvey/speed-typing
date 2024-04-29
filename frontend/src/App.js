import React, { useEffect, useRef, useState } from 'react'

import './App.css';

// TODO: Update word box and put all text / words into a different file
const getWordBox = () => 'random words to test hello keep typing a couple more okay banana elon musk quote of the day'.split(' ')
//.sort(() => Math.random() > 0.5 ? 1 : -1)

function Word(props) {

  const { text, active, correct } = props

  if(correct === true) {
    return <span className="correct">{text} </span>
  }

  if(correct === false) {
    return <span className="incorrect">{text} </span>
  }

  if(active) {
    return <span className="active">{text} </span>
  }

  return <span>{text} </span>
}

Word = React.memo(Word)

function Timer(props) {
  const { correctWords, startCounting } = props
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    let id
    if(startCounting) {
      id = setInterval(() => {
        // do something
        setTimeElapsed(oldTime => oldTime + 1)

      }, 1000)
    }

    return () => {
      clearInterval(id)
    }

  }, [startCounting])

  const minutes = timeElapsed/60

  return <div>
    <p>Time: {timeElapsed}</p>
    <p>Speed: {((correctWords/minutes) || 0).toFixed(2)} WPM</p>
  </div>
}

function App() {

  // in what cases do you need to use [] and in what cases do you not need to?
  const [userInput, setUserInput] = useState('')
  const wordBox = useRef(getWordBox())

  const [startCounting, setStartCounting] = useState(false)

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [correctWordArray, setCorrectWordArray] = useState([])

  function updateUserInput(value) {
    // TODO: Restart button
    // Add a word count and a timer ( to get speed and whatnot )

    if(currentWordIndex === wordBox.current.length) {
      return
    }

    if(!startCounting) {
      setStartCounting(true)
    }

    if(value.endsWith(' ')) {
      
      if(currentWordIndex === wordBox.current.length - 1) {
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
        newResult[currentWordIndex] = word === wordBox.current[currentWordIndex]
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

      <p>{wordBox.current.map((word, index) => {
        
          return <Word 
                  text={word}
                  active={index=== currentWordIndex}
                  correct={correctWordArray[index]}
                  />

      })}</p>
      <input 
          placeholder='Start typing...'
          field="text" 
          value={userInput} 
          onChange={(e) => updateUserInput(e.target.value)}/>

    </div>
  )
}

export default App;
