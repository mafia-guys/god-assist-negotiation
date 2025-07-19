import React from 'react';
import TimerBox from './TimerBox';

const TimerSection = ({ timerDisplays, startTimer, stopTimer }) => {
  return (
    <div id="timerSection">
      <h3>⏳ تایمر بازی</h3>

      <TimerBox
        title="تایمر صحبت (۶۰ ثانیه)"
        display={timerDisplays.talk}
        onStart={(seconds) => startTimer('talk', seconds)}
        onStop={() => stopTimer('talk')}
        startSeconds={60}
      />

      <TimerBox
        title="تایمر چالش / رأی‌گیری (۳۰ ثانیه)"
        display={timerDisplays.challenge}
        onStart={(seconds) => startTimer('challenge', seconds)}
        onStop={() => stopTimer('challenge')}
        startSeconds={30}
      />

      <TimerBox
        title="تایمر آزمایشی (۵ ثانیه)"
        display={timerDisplays.test}
        onStart={(seconds) => startTimer('test', seconds)}
        onStop={() => stopTimer('test')}
        startSeconds={5}
      />
    </div>
  );
};

export default TimerSection;
