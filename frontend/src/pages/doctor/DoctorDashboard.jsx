
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getDoctorUpcomingAppointments, createPatientRecord } from '../../api/doctorApi';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recordSuccess, setRecordSuccess] = useState('');
    const [currentAppointmentForRecord, setCurrentAppointmentForRecord] = useState(null); 
    const [recordData, setRecordData] = useState({
        medicinesPrescribed: '',
        diseaseDescription: '',
        doctorAdvice: '',
    });
    const [showRecordModal, setShowRecordModal] = useState(false);

    const fetchUpcomingAppointments = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getDoctorUpcomingAppointments(user.token);
            setUpcomingAppointments(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch upcoming appointments.');
            setUpcomingAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'doctor') {
            fetchUpcomingAppointments();
        }
    }, [user]);

    const handleTreatPatientClick = (appointment) => {
        setCurrentAppointmentForRecord(appointment);
        setRecordData({
            medicinesPrescribed: '',
            diseaseDescription: appointment.disease, 
            doctorAdvice: '',
        });
        setShowRecordModal(true);
    };

    const handleRecordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setRecordSuccess('');
        setLoading(true);

        if (!currentAppointmentForRecord) {
            setError('No appointment selected for record.');
            setLoading(false);
            return;
        }

        try {
            await createPatientRecord(currentAppointmentForRecord._id, recordData, user.token);
            setRecordSuccess('Medical record saved and appointment closed successfully!');
            setShowRecordModal(false);
            setCurrentAppointmentForRecord(null);
            setRecordData({ medicinesPrescribed: '', diseaseDescription: '', doctorAdvice: '' });
            fetchUpcomingAppointments(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save medical record.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && upcomingAppointments.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-4 text-primary">Doctor Dashboard</h1>

            {error && <div className="alert alert-danger rounded-md mb-4">{error}</div>}
            {recordSuccess && <div className="alert alert-success rounded-md mb-4">{recordSuccess}</div>}

            <Card title="My Upcoming Appointments">
                {upcomingAppointments.length === 0 ? (
                    <p className="text-muted">No upcoming appointments found.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-striped rounded-md overflow-hidden">
                            <thead className="bg-light">
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Patient Name</th>
                                    <th scope="col">Patient Phone</th>
                                    <th scope="col">Disease</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingAppointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                        <td>{appointment.time}</td>
                                        <td>{appointment.patient?.name || 'N/A'}</td>
                                        <td>{appointment.patient?.phoneNumber || 'N/A'}</td>
                                        <td>{appointment.disease}</td>
                                        <td>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleTreatPatientClick(appointment)}
                                            >
                                                <i className="fas fa-notes-medical mr-1"></i> Treat Patient
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Record Treatment Modal */}
            {showRecordModal && currentAppointmentForRecord && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-lg">
                            <div className="modal-header bg-primary text-white rounded-t-lg">
                                <h5 className="modal-title">Record Treatment for {currentAppointmentForRecord.patient.name}</h5>
                                <button type="button" className="btn-close text-white" onClick={() => setShowRecordModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleRecordSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="diseaseDescription" className="form-label">Disease Description & Restrictions/Prohibitions</label>
                                        <textarea
                                            id="diseaseDescription"
                                            className="form-control rounded-md"
                                            rows="3"
                                            value={recordData.diseaseDescription}
                                            onChange={(e) => setRecordData({ ...recordData, diseaseDescription: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="medicinesPrescribed" className="form-label">Medicines Prescribed</label>
                                        <textarea
                                            id="medicinesPrescribed"
                                            className="form-control rounded-md"
                                            rows="3"
                                            placeholder="e.g., Paracetamol (1-1-1 after meals), Amoxicillin 500mg (1-0-1 for 7 days)"
                                            value={recordData.medicinesPrescribed}
                                            onChange={(e) => setRecordData({ ...recordData, medicinesPrescribed: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="doctorAdvice" className="form-label">Doctor's Advice</label>
                                        <textarea
                                            id="doctorAdvice"
                                            className="form-control rounded-md"
                                            rows="3"
                                            placeholder="e.g., Get plenty of rest, drink fluids, follow up in 5 days."
                                            value={recordData.doctorAdvice}
                                            onChange={(e) => setRecordData({ ...recordData, doctorAdvice: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="modal-footer d-flex justify-content-end">
                                        <Button variant="secondary" onClick={() => setShowRecordModal(false)} className="me-2">
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="primary" disabled={loading}>
                                            {loading ? 'Saving...' : 'Save Record & Close Appointment'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default DoctorDashboard;
