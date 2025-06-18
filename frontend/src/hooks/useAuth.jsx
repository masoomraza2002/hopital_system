
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/authApi'; 
   
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
            return null;
        }
    });
    const [loading, setLoading] = useState(true); 
    
    useEffect(() => {
        setLoading(false); 
        
        
    }, []);
    
    const login = useCallback(async (email, password, role) => {
        setLoading(true);
        try {
            const response = await authApi.loginUser({ email, password, role });
            const loggedInUser = response.data;
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser)); 
            return loggedInUser;
        } catch (error) {
            console.error('Login error:', error);
            setUser(null);
            localStorage.removeItem('user');
            throw error; 
        } finally {
            setLoading(false);
        }
    }, []);
    
    const signup = useCallback(async (userData) => {
        setLoading(true);
        try {
            const response = await authApi.registerUser(userData);
            const newUser = response.data;
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser)); 
            return newUser;
        } catch (error) {
            console.error('Signup error:', error);
            setUser(null);
            localStorage.removeItem('user');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user'); 
    }, []);

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
