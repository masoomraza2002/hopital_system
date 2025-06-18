// frontend/src/components/common/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user } = useAuth();
 
    const renderNavLinks = () => {
        if (!user) {
            return null;  
        }

        if (user.role === 'patient') {
            return (
                <>
                    <li>
                        <Link to="/patient/dashboard" className="nav-link text-white no-underline">
                            <i className="fas fa-hospital-user mr-1"></i> My Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/patient/book-appointment" className="nav-link text-white no-underline">
                            <i className="fas fa-calendar-plus mr-1"></i> Book Appointment
                        </Link>
                    </li>
                    <li>
                        <Link to="/patient/records" className="nav-link text-white no-underline">
                            <i className="fas fa-history mr-1"></i> My Previous Records
                        </Link>
                    </li>
                </>
            );
        } else if (user.role === 'doctor') {
            return (
                <>
                    <li>
                        <Link to="/doctor/dashboard" className="nav-link text-white no-underline">
                            <i className="fas fa-user-md mr-1"></i> My Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/doctor/records" className="nav-link text-white no-underline">
                            <i className="fas fa-file-medical mr-1"></i> My Patient Records
                        </Link>
                    </li>
                </>
            );
        }
        return null;
    };

    return (
        <nav className="bg-secondary p-2 shadow-sm">
            <div className="container mx-auto">
                <ul className="flex space-x-6 m-0 p-0 list-none justify-center">
                    {renderNavLinks()}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
