// frontend/src/api/commonApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;
 
export const bookAppointment = async (appointmentData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    return await axios.post(`${API_URL}/appointments`, appointmentData, config);
};
 
export const getPatientUpcomingAppointments = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await axios.get(`${API_URL}/appointments/me/upcoming`, config);
};
 
export const deleteAppointment = async (appointmentId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await axios.delete(`${API_URL}/appointments/${appointmentId}`, config);
};
 
export const getAllDoctors = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await axios.get(`${API_URL}/appointments/doctors`, config);
};
