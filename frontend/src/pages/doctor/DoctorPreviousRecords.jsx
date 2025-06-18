// frontend/src/pages/doctor/DoctorPreviousRecords.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getDoctorPreviousRecords, deleteDoctorRecord } from '../../api/doctorApi';

const DoctorPreviousRecords = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const fetchRecords = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getDoctorPreviousRecords(user.token);
            setRecords(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch previous records.');
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'doctor') {
            fetchRecords();
        }
    }, [user]);

    const handleDeleteClick = (record) => {
        setRecordToDelete(record);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (recordToDelete) {
            setLoading(true);
            setError('');
            setDeleteSuccess('');
            try {
                await deleteDoctorRecord(recordToDelete._id, user.token);
                setDeleteSuccess('Record deleted successfully!');
                setRecordToDelete(null);
                setShowModal(false);
                fetchRecords();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete record.');
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
            <h1 className="text-3xl font-bold mb-4 text-primary">My Patient Records</h1>

            {error && <div className="alert alert-danger rounded-md mb-4">{error}</div>}
            {deleteSuccess && <div className="alert alert-success rounded-md mb-4">{deleteSuccess}</div>}

            <Card title="List of All Treated Patients">
                {records.length === 0 ? (
                    <p className="text-muted">No patient records created by you yet.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-striped rounded-md overflow-hidden">
                            <thead className="bg-light">
                                <tr>
                                    <th scope="col">Date of Checkup</th>
                                    <th scope="col">Patient Name</th>
                                    <th scope="col">Patient Phone</th>
                                    <th scope="col">Disease</th>
                                    <th scope="col">Medicines Prescribed</th>
                                    <th scope="col">Doctor's Advice</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record._id}>
                                        <td>{new Date(record.appointment.date).toLocaleDateString()}</td>
                                        <td>{record.patient?.name || 'N/A'}</td>
                                        <td>{record.patient?.phoneNumber || 'N/A'}</td>
                                        <td>{record.diseaseDescription}</td>
                                        <td>{record.medicinesPrescribed || 'N/A'}</td>
                                        <td>{record.doctorAdvice || 'N/A'}</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(record)}
                                            >
                                                <i className="fas fa-trash-alt mr-1"></i> Delete My Entry
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
                                Are you sure you want to delete your record for {recordToDelete?.patient?.name || 'this patient'} from {new Date(recordToDelete?.appointment?.date).toLocaleDateString()}? This action will reopen the appointment for a new record.
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={confirmDelete} disabled={loading}>
                                    {loading ? 'Deleting...' : 'Delete Record'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default DoctorPreviousRecords;
