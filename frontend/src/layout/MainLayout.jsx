// frontend/src/layout/MainLayout.jsx
import React from 'react';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
 
const MainLayout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <Navbar />
            <main className="flex-grow-1 p-4 bg-light">
                <div className="container mx-auto">
                    {children}  
                </div>
            </main>
             
        </div>
    );
};

export default MainLayout;
