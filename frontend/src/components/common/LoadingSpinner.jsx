// frontend/src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="ms-3 text-primary">Loading...</p>
        </div>
    );
};

export default LoadingSpinner;
