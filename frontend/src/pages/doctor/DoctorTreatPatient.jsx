
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { createPatientRecord } from '../../api/doctorApi'; 
import { getPatientUpcomingAppointments } from '../../api/commonApi'; 

const DoctorTreatPatient = () => {
    const { appointmentId } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuth();

    const [appointment, setAppointment] = useState(null);
    const [recordData, setRecordData] = useState({
        medicinesPrescribed: '',
        diseaseDescription: '',
        doctorAdvice: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            setLoading(true);
            setError('');
            try {
                
                
                
                const res = await getPatientUpcomingAppointments(user.token); 
                const foundAppointment = res.data.find(app => app._id === appointmentId);

                if (foundAppointment && foundAppointment.doctor._id === user.id) {
                    setAppointment(foundAppointment);
                    setRecordData(prev => ({ ...prev, diseaseDescription: foundAppointment.disease }));
                } else {
                    setError('Appointment not found or not authorized.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load appointment details.');
            } finally {
                setLoading(false);
            }
        };

        if (user && appointmentId) {
            fetchAppointmentDetails();
        }
    }, [user, appointmentId]);

    const handleRecordChange = (e) => {
        const { name, value } = e.target;
        setRecordData({ ...recordData, [name]: value });
    };

    const handleSubmitRecord = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!recordData.diseaseDescription || !recordData.medicinesPrescribed || !recordData.doctorAdvice) {
            setError('Please fill in all fields for the record.');
            setLoading(false);
            return;
        }

        try {
            await createPatientRecord(appointmentId, recordData, user.token);
            setSuccessMessage('Medical record saved successfully and appointment closed!');
            setTimeout(() => {
                navigate('/doctor/dashboard'); 
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save medical record.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error && !appointment) { 
        return (
            <MainLayout>
                <div className="alert alert-danger rounded-md">{error}</div>
                <Button variant="secondary" onClick={() => navigate('/doctor/dashboard')}>
                    Back to Dashboard
                </Button>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-4 text-primary">Treat Patient</h1>

            {error && <div className="alert alert-danger rounded-md mb-4">{error}</div>}
            {successMessage && <div className="alert alert-success rounded-md mb-4">{successMessage}</div>}

            {appointment ? (
                <Card title={`Recording Treatment for ${appointment.patient?.name || 'N/A'}`}>
                    <p><strong>Appointment Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                    <p><strong>Appointment Time:</strong> {appointment.time}</p>
                    <p><strong>Initial Disease:</strong> {appointment.disease}</p>
                    <p><strong>Patient Phone:</strong> {appointment.patient?.phoneNumber || 'N/A'}</p>

                    <hr className="my-4" />

                    <form onSubmit={handleSubmitRecord}>
                        <div className="mb-3">
                            <label htmlFor="diseaseDescription" className="form-label">Disease Description & Restrictions/Prohibitions</label>
                            <textarea
                                id="diseaseDescription"
                                name="diseaseDescription"
                                className="form-control rounded-md"
                                rows="4"
                                value={recordData.diseaseDescription}
                                onChange={handleRecordChange}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="medicinesPrescribed" className="form-label">Medicines Prescribed</label>
                            <textarea
                                id="medicinesPrescribed"
                                name="medicinesPrescribed"
                                className="form-control rounded-md"
                                rows="4"
                                placeholder="e.g., Paracetamol (1-1-1 after meals), Amoxicillin 500mg (1-0-1 for 7 days)"
                                value={recordData.medicinesPrescribed}
                                onChange={handleRecordChange}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="doctorAdvice" className="form-label">Doctor's Advice</label>
                            <textarea
                                id="doctorAdvice"
                                name="doctorAdvice"
                                className="form-control rounded-md"
                                rows="4"
                                placeholder="e.g., Get plenty of rest, drink fluids, follow up in 5 days."
                                value={recordData.doctorAdvice}
                                onChange={handleRecordChange}
                                required
                            ></textarea>
                        </div>
                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={() => navigate('/doctor/dashboard')}>
                                Back to Dashboard
                            </Button>
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Saving Record...
                                    </>
                                ) : (
                                    'Save Record & Close Appointment'
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            ) : (
                <p className="text-muted">No appointment details to display.</p>
            )}
        </MainLayout>
    );
};

export default DoctorTreatPatient;
