import React from 'react';

const GameControls = ({ playerCount, setPlayerCount, startGame }) => {
  const playerOptions = [7, 8, 9, 10, 11, 12, 13, 14];

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Welcome Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">
              <i className="bi bi-people-fill me-3"></i>
              بازی مافیا
            </h1>
            <p className="lead text-muted">
              بازی استراتژیک و هیجان‌انگیز مافیا با تخصیص خودکار نقش‌ها
            </p>
          </div>

          {/* Player Count Selection Card */}
          <div className="card shadow-lg border-0 mb-4">
            <div className="card-header bg-primary text-white text-center py-3">
              <h4 className="mb-0">
                <i className="bi bi-gear-fill me-2"></i>
                انتخاب تعداد بازیکنان
              </h4>
            </div>
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <label className="form-label fs-5 fw-semibold mb-3">
                  <i className="bi bi-person-plus me-2 text-primary"></i>
                  تعداد بازیکنان را انتخاب کنید:
                </label>
                <p className="text-muted small mb-0">
                  حداقل ۷ و حداکثر ۱۴ بازیکن
                </p>
              </div>
              
              {/* Player Count Buttons */}
              <div className="row g-2 mb-4">
                {playerOptions.map((count) => (
                  <div key={count} className="col-6 col-md-3">
                    <button
                      className={`btn w-100 btn-lg fw-bold ${
                        playerCount === count 
                          ? 'btn-primary shadow-lg' 
                          : 'btn-outline-primary'
                      }`}
                      onClick={() => setPlayerCount(count)}
                      style={{
                        borderRadius: '12px',
                        fontSize: '1.2rem',
                        padding: '12px',
                        transform: playerCount === count ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        border: playerCount === count ? '3px solid #0056b3' : '2px solid #007bff'
                      }}
                    >
                      {count} نفر
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Selected Count Display */}
              <div className="text-center mb-3">
                <div 
                  className="d-inline-block px-4 py-2 bg-primary text-white rounded-pill fw-bold"
                  style={{ fontSize: '1.1rem' }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  انتخاب شده: {playerCount} بازیکن
                </div>
              </div>
              
              {/* Role Preview */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted d-block mb-2">
                  <i className="bi bi-info-circle me-1"></i>
                  نقش‌های این بازی ({playerCount} بازیکن):
                </small>
                <div className="d-flex flex-wrap gap-1">
                  {getRolesForCount(playerCount).map((role, index) => (
                    <span 
                      key={index}
                      className={`badge ${role.includes('مافیا') || role.includes('مذاکره‌گر') ? 'bg-danger' : 'bg-success'} me-1 mb-1`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Start Game Button */}
          <div className="text-center">
            <button 
              className="btn btn-success btn-lg px-5 py-3 shadow-lg"
              onClick={startGame}
              style={{
                fontSize: '1.3rem',
                borderRadius: '15px',
                background: 'linear-gradient(45deg, #28a745, #20c997)',
                border: 'none',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <i className="bi bi-play-circle-fill me-2"></i>
              شروع بازی با {playerCount} بازیکن
            </button>
          </div>

          {/* Game Rules */}
          <div className="mt-5">
            <div className="card border-0 bg-light">
              <div className="card-body p-4">
                <h5 className="card-title text-center mb-3">
                  <i className="bi bi-book me-2 text-info"></i>
                  راهنمای سریع
                </h5>
                <div className="row text-center">
                  <div className="col-md-4 mb-3">
                    <div className="p-3">
                      <i className="bi bi-1-circle-fill text-primary fs-3 mb-2 d-block"></i>
                      <small className="text-muted">تعداد بازیکنان را انتخاب کنید</small>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3">
                      <i className="bi bi-2-circle-fill text-primary fs-3 mb-2 d-block"></i>
                      <small className="text-muted">روی شروع بازی کلیک کنید</small>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3">
                      <i className="bi bi-3-circle-fill text-primary fs-3 mb-2 d-block"></i>
                      <small className="text-muted">نقش‌ها را به بازیکنان اختصاص دهید</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get roles for a specific player count
const getRolesForCount = (count) => {
  const rolesByCount = {
    7: ["رئیس مافیا", "مافیای ساده", "پزشک", "کارآگاه", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
    8: ["رئیس مافیا", "مافیای ساده", "پزشک", "کارآگاه", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
    9: ["رئیس مافیا", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "تک‌تیرانداز", "زره‌پوش", "شهروند ساده", "شهروند ساده"],
    10: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "شهروند ساده", "شهروند ساده"],
    11: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
    12: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "کنستانتین", "شهروند ساده", "شهروند ساده"],
    13: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
    14: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "کنستانتین", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"]
  };
  return rolesByCount[count] || [];
};

export default GameControls;
