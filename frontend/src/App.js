import React, { useEffect, useState } from "react";
import SpeedTestArea from "./components/SpeedTestArea";
import TimerComponent from "./components/TimerComponent";
import {Auth} from "./components/auth";
import RestartComponent from "./components/RestartComponent";
import wordsData from "./words/English.json"; // Ensure this import is correct

function App() {
  const [userInput, setUserInput] = useState("");
  const [rows, setRows] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTestOver, setIsTestOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startCounting, setStartCounting] = useState(false);

  const [previousWords, setPreviousWords] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);

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
    return wordsData[Math.floor(Math.random() * wordsData.length)];
  };

  const handleUserInput = (e) => {
    const inputValue = e.target.value;
    setUserInput(inputValue);

    if (inputValue.endsWith(" ") && inputValue.trim() !== "") {
      processInput(inputValue.trim());
    }
  };

  const processInput = (input) => {
    const currentWords = rows[0];
    const currentWord = currentWords[currentWordIndex];
    const isCorrect = input === currentWord;

    if (isCorrect) {
      correctChars += currentWord.length;
    }

    setTotalChars(totalChars + input.length);
    setPreviousWords([
      ...previousWords,
      { word: currentWord, correct: isCorrect },
    ]);
    setWordCount(wordCount + 1);

    if (currentWordIndex === currentWords.length - 1) {
      setCurrentWordIndex(0);
      setRows([rows[1], generateRow()]);
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const getCorrectValue = (previousWords, idx, wordIdx, defaultValue) => {
    try {
      return previousWords[calculateGlobalIndex(idx, wordIdx)].correct;
    } catch (error) {
      return defaultValue; // set defaultValue to whatever you want to return in case of an error
    }
  };

  return (
    <div>
      <Auth />
      <TimerComponent
        startCounting={startCounting}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        correctChars={correctChars}
        totalChars={totalChars}
      />
      <SpeedTestArea
        rows={rows}
        handleUserInput={handleUserInput}
        userInput={userInput}
        isTestOver={isTestOver}
        getCorrectValue={getCorrectValue} // Passing getCorrectValue as a prop
        previousWords={previousWords}
      />
      <RestartComponent isTestOver={isTestOver} />
    </div>
  );
}

export default App;
