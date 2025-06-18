
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getAllDoctors, bookAppointment } from '../../api/commonApi';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 

const PatientBookAppointment = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const diseases = [
        'General Checkup', 'Fever', 'Cough/Cold', 'Dermatology', 'Cardiology',
        'Pediatrics', 'Orthopedics', 'Neurology', 'Gastroenterology'
    ]; 

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const res = await getAllDoctors(user.token);
                setDoctors(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch doctors.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'patient') {
            fetchDoctors();
        }
    }, [user]);

    const filteredDoctors = selectedDisease
        ? doctors.filter(doc => doc.specialization && doc.specialization.toLowerCase().includes(selectedDisease.toLowerCase()))
        : doctors;

    const generateTimeSlots = () => {
        const slots = [];
        for (let i = 9; i <= 17; i++) { 
            slots.push(`${i.toString().padStart(2, '0')}:00`);
            slots.push(`${i.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!selectedDisease || !selectedDoctorId || !selectedDate || !selectedTime) {
            setError('Please fill all appointment details.');
            setLoading(false);
            return;
        }

        try {
            await bookAppointment({
                doctorId: selectedDoctorId,
                date: selectedDate.toISOString().split('T')[0], 
                time: selectedTime,
                disease: selectedDisease,
            }, user.token);
            setSuccessMessage('Appointment booked successfully!');
            
            setSelectedDisease('');
            setSelectedDoctorId('');
            setSelectedDate(new Date());
            setSelectedTime('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && doctors.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-4 text-primary">Book New Appointment</h1>

            {error && <div className="alert alert-danger rounded-md mb-4">{error}</div>}
            {successMessage && <div className="alert alert-success rounded-md mb-4">{successMessage}</div>}

            <Card title="Appointment Details">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="diseaseSelect" className="form-label">Select Disease</label>
                        <select
                            id="diseaseSelect"
                            className="form-select rounded-md"
                            value={selectedDisease}
                            onChange={(e) => {
                                setSelectedDisease(e.target.value);
                                setSelectedDoctorId(''); 
                            }}
                            required
                        >
                            <option value="">-- Select Disease --</option>
                            {diseases.map((disease) => (
                                <option key={disease} value={disease}>{disease}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="doctorSelect" className="form-label">Select Doctor</label>
                        <select
                            id="doctorSelect"
                            className="form-select rounded-md"
                            value={selectedDoctorId}
                            onChange={(e) => setSelectedDoctorId(e.target.value)}
                            required
                            disabled={!selectedDisease || filteredDoctors.length === 0}
                        >
                            <option value="">-- Select Doctor --</option>
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doc) => (
                                    <option key={doc._id} value={doc._id}>
                                        Dr. {doc.name} ({doc.specialization})
                                    </option>
                                ))
                            ) : (
                                <option disabled>No doctors available for this specialization</option>
                            )}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="datePicker" className="form-label">Select Date</label>
                        <DatePicker
                            id="datePicker"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            minDate={new Date()} 
                            className="form-control rounded-md w-100"
                            dateFormat="yyyy/MM/dd"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="timeSelect" className="form-label">Select Time</label>
                        <select
                            id="timeSelect"
                            className="form-select rounded-md"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            required
                        >
                            <option value="">-- Select Time Slot --</option>
                            {generateTimeSlots().map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>

                    <Button type="submit" variant="primary" className="w-100 rounded-md" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Booking...
                            </>
                        ) : (
                            'Book Appointment'
                        )}
                    </Button>
                </form>
            </Card>
        </MainLayout>
    );
};

export default PatientBookAppointment;
