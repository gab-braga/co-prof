import { useEffect, useRef, useState } from 'react';

export default () => {
  const [time, setTime] = useState(0);
  const timerInterval = useRef(0);

  function startTimer() {
    setTime(0);
    createTimerInterval();
  }

  function pauseTimer() {
    clearTimerInterval();
  }

  function resumeTimer() {
    createTimerInterval();
  }

  function stopTimer() {
    setTime(0);
    clearTimerInterval();
  }

  useEffect(() => {
    return () => clearTimerInterval();
  }, []);

  function createTimerInterval() {
    const range = 100;
    timerInterval.current = setInterval(() => {
      setTime((time) => time + range);
    }, range);
  }

  function clearTimerInterval() {
    if (timerInterval.current) clearInterval(timerInterval.current);
  }

  return { time, startTimer, pauseTimer, resumeTimer, stopTimer };
};
