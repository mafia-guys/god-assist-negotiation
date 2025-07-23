import React from 'react';

const DayNavigation = ({ 
  currentDay, 
  allDays, 
  switchToDay, 
  startNextDay, 
  isDayCompleted,
  canStartNextDay 
}) => {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <h5 className="mb-0">روز {currentDay}</h5>
                {isDayCompleted && (
                  <span className="badge bg-success">تمام شده</span>
                )}
                {!isDayCompleted && (
                  <span className="badge bg-primary">در حال انجام</span>
                )}
              </div>
              
              <div className="d-flex gap-2">
                {/* Day Navigation Buttons */}
                {allDays.map(day => (
                  <button
                    key={day}
                    className={`btn btn-sm ${
                      currentDay === day 
                        ? 'btn-primary' 
                        : allDays.includes(day) && day < currentDay 
                          ? 'btn-outline-success' 
                          : 'btn-outline-secondary'
                    }`}
                    onClick={() => switchToDay(day)}
                    disabled={day > Math.max(...allDays)}
                  >
                    روز {day}
                  </button>
                ))}
                
                {/* Start Next Day Button */}
                {canStartNextDay && !isDayCompleted && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={startNextDay}
                  >
                    شروع روز بعد
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayNavigation;
