// frontend/src/api/doctorApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;
 
export const getDoctorUpcomingAppointments = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await axios.get(`${API_URL}/doctors/me/appointments/upcoming`, config);
};
 
export const getDoctorAssignedPatients = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await axios.get(`${API_URL}/doctors/me/appointments/assigned`, config);
};
 
export const createPatientRecord = async (appointmentId, recordData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    return await axios.post(`${API_URL}/doctors/record/${appointmentId}`, recordData, config);
};
 
export const getDoctorPreviousRecords = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await axios.get(`${API_URL}/doctors/me/records`, config);
};
 
export const deleteDoctorRecord = async (recordId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await axios.delete(`${API_URL}/doctors/me/records/${recordId}`, config);
};
