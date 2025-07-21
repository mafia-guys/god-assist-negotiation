import React from 'react';
import { Link } from 'react-router-dom';
import { DayControl } from '../components';

const DayControlPage = ({ currentRoles, assignments }) => {
  return (
    <div>
      {/* Header */}
      <div className="container py-2">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="text-center mb-0">
                <i className="bi bi-sun-fill me-2 text-warning"></i>
                کنترل روز بازی
              </h4>
              
              <Link to="/god-view" className="btn btn-outline-primary btn-sm">
                <i className="bi bi-arrow-left me-1"></i>
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentRoles && currentRoles.length > 0 ? (
        <DayControl currentRoles={currentRoles} assignments={assignments} />
      ) : (
        <div className="container text-center py-5">
          <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '400px' }}>
            <div className="card-body p-4">
              <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
              <h5 className="mb-2">بازی شروع نشده!</h5>
              <p className="text-muted mb-3">برای استفاده از کنترل روز، ابتدا بازی را شروع کنید.</p>
              <Link to="/" className="btn btn-primary">
                <i className="bi bi-play-circle me-1"></i>
                رفتن به صفحه کنترل بازی
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayControlPage;
