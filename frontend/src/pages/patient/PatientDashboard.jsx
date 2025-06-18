
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getPatientUpcomingAppointments, deleteAppointment } from '../../api/commonApi';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);

    const fetchUpcomingAppointments = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getPatientUpcomingAppointments(user.token);
            setUpcomingAppointments(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch upcoming appointments.');
            setUpcomingAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'patient') {
            fetchUpcomingAppointments();
        }
    }, [user]);

    const handleDeleteClick = (appointment) => {
        setAppointmentToDelete(appointment);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (appointmentToDelete) {
            setLoading(true);
            setError('');
            setDeleteSuccess('');
            try {
                await deleteAppointment(appointmentToDelete._id, user.token);
                setDeleteSuccess('Appointment deleted successfully!');
                setAppointmentToDelete(null);
                setShowModal(false);
                fetchUpcomingAppointments(); 
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete appointment.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-4 text-primary">Patient Dashboard</h1>

            {error && <div className="alert alert-danger rounded-md mb-4">{error}</div>}
            {deleteSuccess && <div className="alert alert-success rounded-md mb-4">{deleteSuccess}</div>}

            <div className="mb-4 d-flex justify-content-end">
                <Button variant="primary" onClick={() => navigate('/patient/book-appointment')}>
                    <i className="fas fa-calendar-plus mr-2"></i> Book New Appointment
                </Button>
            </div>

            <Card title="My Upcoming Appointments">
                {upcomingAppointments.length === 0 ? (
                    <p className="text-muted">No upcoming appointments found. <a href="/patient/book-appointment">Book one now!</a></p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-striped rounded-md overflow-hidden">
                            <thead className="bg-light">
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Doctor</th>
                                    <th scope="col">Specialization</th>
                                    <th scope="col">Disease</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingAppointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                        <td>{appointment.time}</td>
                                        <td>{appointment.doctor?.name || 'N/A'}</td>
                                        <td>{appointment.doctor?.specialization || 'N/A'}</td>
                                        <td>{appointment.disease}</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(appointment)}
                                            >
                                                <i className="fas fa-trash-alt mr-1"></i> Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-lg">
                            <div className="modal-header bg-warning text-white rounded-t-lg">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close text-white" onClick={() => setShowModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete your appointment with Dr. {appointmentToDelete?.doctor?.name || 'N/A'} on {new Date(appointmentToDelete?.date).toLocaleDateString()} at {appointmentToDelete?.time}?
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={confirmDelete} disabled={loading}>
                                    {loading ? 'Deleting...' : 'Delete Appointment'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default PatientDashboard;
