import React from 'react';

const TimerBox = ({ title, display, onStart, onStop, startSeconds }) => {
  return (
    <div className="timerBox">
      <h4>{title}</h4>
      <div className="timerDisplay">{display}</div>
      <button className="btn btn-success me-2" onClick={() => onStart(startSeconds)}>
        <i className="bi bi-play-fill"></i> شروع
      </button>
      <button className="btn btn-danger" onClick={onStop}>
        <i className="bi bi-stop-fill"></i> توقف
      </button>
    </div>
  );
};

export default TimerBox;
