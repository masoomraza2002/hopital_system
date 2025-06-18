
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner'; 
 
const PrivateRoute = ({ role }) => {
    const { user, loading } = useAuth(); 

    if (loading) {        
        return <LoadingSpinner />;
    }
   
    if (user && user.token && user.role === role) {
        return <Outlet />; 
    }
    
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;
