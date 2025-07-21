import React from 'react';

const GodView = ({ godView, showGodViewHandler }) => {
  return (
    <>
      <div style={{height: '100px'}}></div>
      <button id="godButton" className="btn btn-danger" onClick={showGodViewHandler}>
        <i className="bi bi-list-ul"></i> نمایش لیست نقش‌ها برای گرداننده
      </button>
      {godView && (
        <div 
          id="godView" 
          className="mt-4" 
          style={{
            direction: 'rtl',
            textAlign: 'right',
            fontFamily: 'Arial, sans-serif'
          }}
          dangerouslySetInnerHTML={{__html: godView}}
        />
      )}
    </>
  );
};

export default GodView;
