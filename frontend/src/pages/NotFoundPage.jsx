// frontend/src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-center">
            <h1 className="display-1 text-danger">404</h1>
            <p className="lead text-secondary mb-4">Page Not Found</p>
            <p className="mb-4">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <Link to="/" className="btn btn-primary rounded-md">Go to Homepage</Link>
        </div>
    );
};

export default NotFoundPage;
