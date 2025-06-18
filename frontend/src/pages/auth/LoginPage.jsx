
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layout/AuthLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient'); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, login } = useAuth();
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
        setLoading(true);

        try {
            const loggedInUser = await login(email, password, role);
            if (loggedInUser.role === 'patient') {
                navigate('/patient/dashboard');
            } else if (loggedInUser.role === 'doctor') {
                navigate('/doctor/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <h2 className="text-center mb-4 text-primary">Login to HMS</h2>
            {error && <div className="alert alert-danger rounded-md">{error}</div>}
            <form onSubmit={handleSubmit}>
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
                    <label htmlFor="roleSelect" className="form-label">Login As</label>
                    <select
                        id="roleSelect"
                        className="form-select rounded-md"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>
                <Button type="submit" variant="primary" className="w-100 rounded-md" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Logging In...
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>
            </form>
            <p className="mt-3 text-center">
                Don't have an account? <a href="/signup" className="text-primary no-underline">Sign Up</a>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;
