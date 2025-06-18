// frontend/src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');  
    };

    return (
        <header className="bg-primary text-white p-3 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-white no-underline">
                    HMS
                </Link>
                <nav>
                    <ul className="flex space-x-4 m-0 p-0 list-none">
                        {user ? (
                            <>
                                <li>
                                    <span className="text-white">Welcome, {user.name} ({user.role})</span>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-outline-light btn-sm rounded-md"
                                    >
                                        <i className="fas fa-sign-out-alt mr-1"></i> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="btn btn-outline-light btn-sm rounded-md">
                                        <i className="fas fa-sign-in-alt mr-1"></i> Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="btn btn-outline-light btn-sm rounded-md">
                                        <i className="fas fa-user-plus mr-1"></i> Signup
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
