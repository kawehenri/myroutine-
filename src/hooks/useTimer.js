import { useState, useEffect, useRef } from 'react';

/**
 * Hook customizado para gerenciar timer de foco
 * @param {function} onComplete - Callback quando timer finaliza
 * @returns {object} - Estado e controles do timer
 */
export function useTimer(onComplete) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onComplete]);

  const start = (initialSeconds) => {
    setSeconds(initialSeconds);
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const stop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    seconds,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    formatTime,
  };
}

