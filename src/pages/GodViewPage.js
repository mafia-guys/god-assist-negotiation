import React from 'react';
import { Link } from 'react-router-dom';
import { GodViewDisplay } from '../components';

const GodViewPage = ({ currentRoles, assignments }) => {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            
            <h4 className="text-center mb-0">
              لیست نهایی بازیکنان
            </h4>

            <Link to="/" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-arrow-left"></i>
            </Link>
          </div>
          
          {/* Content */}
          {currentRoles && currentRoles.length > 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <GodViewDisplay currentRoles={currentRoles} assignments={assignments} />
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '300px' }}>
                <div className="card-body p-4">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h5 className="mb-2">در حال بارگذاری...</h5>
                  <p className="text-muted mb-0 small">لطفاً صبر کنید تا لیست آماده شود</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GodViewPage;
