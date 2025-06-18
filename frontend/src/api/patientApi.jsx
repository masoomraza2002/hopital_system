// frontend/src/api/patientApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;
 
export const getPatientPreviousRecords = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await axios.get(`${API_URL}/patients/me/records`, config);
};
 
export const deletePatientPreviousRecord = async (recordId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await axios.delete(`${API_URL}/patients/me/records/${recordId}`, config);
};
