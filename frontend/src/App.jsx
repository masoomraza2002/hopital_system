 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientPreviousRecords from './pages/patient/PatientPreviousRecords';
import PatientBookAppointment from './pages/patient/PatientBookAppointment';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPreviousRecords from './pages/doctor/DoctorPreviousRecords';

import NotFoundPage from './pages/NotFoundPage';

import PrivateRoute from './components/common/PrivateRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    
    const getInitialRedirectPath = () => {
        if (user) {
            if (user.role === 'patient') return '/patient/dashboard';
            if (user.role === 'doctor') return '/doctor/dashboard';
        }
        return '/login'; 
    };

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/" element={<Navigate to={getInitialRedirectPath()} replace />} />

            <Route element={<PrivateRoute role="patient" />}>
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/records" element={<PatientPreviousRecords />} />
                <Route path="/patient/book-appointment" element={<PatientBookAppointment />} />
            </Route>

            <Route element={<PrivateRoute role="doctor" />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/records" element={<DoctorPreviousRecords />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

export default App;
