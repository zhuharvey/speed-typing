import React, { useEffect, useState } from 'react';

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

export default Timer;