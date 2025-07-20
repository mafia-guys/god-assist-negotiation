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
          <div className="mb-4 text-center">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-arrow-right me-1"></i>
              بازگشت به بازی
            </Link>
          </div>
          
          {godView ? (
            <div dangerouslySetInnerHTML={{ __html: godView }} />
          ) : (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">در حال بارگذاری لیست...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GodViewPage;
