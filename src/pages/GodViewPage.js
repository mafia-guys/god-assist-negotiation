import React from 'react';
import { Link } from 'react-router-dom';

const GodViewPage = ({ godView, showGodViewHandler }) => {
  // Generate the god view if it doesn't exist yet
  React.useEffect(() => {
    if (!godView) {
      showGodViewHandler();
    }
  }, [godView, showGodViewHandler]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Link to="/" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-arrow-right"></i>
            </Link>
            
            <h4 className="text-center mb-0">
               نقشهای بازیکنان
            </h4>
            
            <div style={{ width: '32px' }}></div>
          </div>
          
          {/* Content */}
          {godView ? (
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div dangerouslySetInnerHTML={{ __html: godView }} />
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
