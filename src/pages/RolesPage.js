import React from 'react';

const RolesPage = ({ currentRoles, getRoleIcon }) => {
  return (
    <div className="container text-center">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h2 className="mb-4">نقش‌های بازی</h2>
          
          {currentRoles && currentRoles.length > 0 ? (
            <div className="row g-3">
              {currentRoles.map((role, index) => (
                <div key={index} className="col-md-4 col-sm-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column align-items-center">
                      <div className="mb-3">
                        <img 
                          src={getRoleIcon(role)} 
                          alt={role}
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          className="rounded-circle"
                        />
                      </div>
                      <h5 className="card-title">{role}</h5>
                      <small className="text-muted">بازیکن {index + 1}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info" role="alert">
              <h4 className="alert-heading">هنوز بازی شروع نشده!</h4>
              <p>برای مشاهده نقش‌ها، ابتدا از صفحه کنترل بازی، بازی را شروع کنید.</p>
              <hr />
              <p className="mb-0">پس از شروع بازی، نقش‌های تخصیص یافته در این صفحه نمایش داده خواهند شد.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
