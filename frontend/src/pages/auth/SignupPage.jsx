
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layout/AuthLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [specialization, setSpecialization] = useState(''); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { user, signup } = useAuth();
    const navigate = useNavigate();

    
    useEffect(() => {
        if (user) {
            if (user.role === 'patient') {
                navigate('/patient/dashboard');
            } else if (user.role === 'doctor') {
                navigate('/doctor/dashboard');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        const userData = {
            name,
            email,
            password,
            role,
            phoneNumber,
            ...(role === 'doctor' && { specialization }), 
        };

        try {
            await signup(userData);
            setSuccessMessage('Registration successful! Redirecting to dashboard...');
            
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <h2 className="text-center mb-4 text-primary">Sign Up for HMS</h2>
            {error && <div className="alert alert-danger rounded-md">{error}</div>}
            {successMessage && <div className="alert alert-success rounded-md">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nameInput" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control rounded-md"
                        id="nameInput"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control rounded-md"
                        id="emailInput"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control rounded-md"
                        id="passwordInput"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control rounded-md"
                        id="confirmPasswordInput"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phoneNumberInput" className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        className="form-control rounded-md"
                        id="phoneNumberInput"
                        placeholder="e.g., +919876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="roleSelect" className="form-label">Register As</label>
                    <select
                        id="roleSelect"
                        className="form-select rounded-md"
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            if (e.target.value === 'patient') {
                                setSpecialization(''); 
                            }
                        }}
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>
                {role === 'doctor' && (
                    <div className="mb-3">
                        <label htmlFor="specializationInput" className="form-label">Specialization</label>
                        <input
                            type="text"
                            className="form-control rounded-md"
                            id="specializationInput"
                            placeholder="e.g., Cardiology, Pediatrics"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            required={role === 'doctor'}
                        />
                    </div>
                )}
                <Button type="submit" variant="primary" className="w-100 rounded-md" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Registering...
                        </>
                    ) : (
                        'Register'
                    )}
                </Button>
            </form>
            <p className="mt-3 text-center">
                Already have an account? <a href="/login" className="text-primary no-underline">Login</a>
            </p>
        </AuthLayout>
    );
};

export default SignupPage;
