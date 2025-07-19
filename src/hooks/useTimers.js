import { useState, useCallback, useRef } from 'react';

const useTimers = () => {
  const [timers, setTimers] = useState({ talk: null, challenge: null, test: null });
  const [timerDisplays, setTimerDisplays] = useState({ talk: '--:--', challenge: '--:--', test: '--:--' });
  const alarmRef = useRef(null);

  const playAlarm = useCallback(() => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
      alarmRef.current.play().catch(e => console.warn("Audio play failed:", e));
    }
  }, []);

  const startTimer = useCallback((type, seconds) => {
    // Clear existing timer
    if (timers[type]) {
      clearInterval(timers[type]);
    }
    
    let time = seconds;
    const timer = setInterval(() => {
      const min = Math.floor(time / 60);
      const sec = time % 60;
      const display = `${min}:${sec < 10 ? '0' : ''}${sec}`;
      
      setTimerDisplays(prev => ({ ...prev, [type]: display }));
      time--;
      
      if (time < 0) {
        clearInterval(timer);
        setTimerDisplays(prev => ({ ...prev, [type]: "⏰ زمان تمام شد!" }));
        playAlarm();
        setTimers(prev => ({ ...prev, [type]: null }));
      }
    }, 1000);
    
    setTimers(prev => ({ ...prev, [type]: timer }));
  }, [timers, playAlarm]);

  const stopTimer = useCallback((type) => {
    if (timers[type]) {
      clearInterval(timers[type]);
      setTimers(prev => ({ ...prev, [type]: null }));
    }
    setTimerDisplays(prev => ({ ...prev, [type]: "--:--" }));
  }, [timers]);

  return {
    timers,
    timerDisplays,
    alarmRef,
    startTimer,
    stopTimer
  };
};

export default useTimers;
