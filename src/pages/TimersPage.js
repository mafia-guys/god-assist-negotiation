import React from 'react';
import { TimerSection } from '../components';

const TimersPage = ({ timerDisplays, startTimer, stopTimer }) => {
  return (
    <div className="container text-center">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-4">تایمرهای بازی</h2>
          
          <div className="alert alert-info mb-4" role="alert">
            <h5 className="alert-heading">راهنمای استفاده از تایمرها</h5>
            <ul className="list-unstyled text-start mb-0">
              <li><strong>شب:</strong> زمان فعالیت مافیا و نقش‌های شب</li>
              <li><strong>روز:</strong> زمان بحث و تصمیم‌گیری شهروندان</li>
              <li><strong>دفاع:</strong> زمان دفاع بازیکن در معرض اعدام</li>
              <li><strong>رای‌گیری:</strong> زمان رای‌گیری نهایی</li>
            </ul>
          </div>

          <TimerSection 
            timerDisplays={timerDisplays}
            startTimer={startTimer}
            stopTimer={stopTimer}
          />
        </div>
      </div>
    </div>
  );
};

export default TimersPage;
