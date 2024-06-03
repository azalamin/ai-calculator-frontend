import React from 'react';

const FinalFeedback = () => {
    return (
        <div className="px-5 pt-5">
            <h1 className="text-start">Factors on your report</h1>
            <div style={{
                width: '100%',
                height: '2px',
                background: '#D3D3D3'
            }}></div>
            <div className="d-flex justify-content-between">
                <div className="bg-secondary">Pros</div>
                <div className="bg-primary">Corns</div>
            </div>
        </div>
    );
};

export default FinalFeedback;