// frontend/src/layout/AuthLayout.jsx
import React from 'react';
import Header from '../components/common/Header';  
 
const AuthLayout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />  
            <main className="flex-grow-1 d-flex justify-content-center align-items-center p-4">
                <div className="card shadow-lg rounded-lg w-100" style={{ maxWidth: '450px' }}>
                    <div className="card-body p-5">
                        {children}  
                    </div>
                </div>
            </main> 
        </div>
    );
};

export default AuthLayout;
