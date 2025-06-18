
const express = require('express');
const {
    getDoctorUpcomingAppointments,
    getDoctorAssignedPatients,
    createPatientRecord,
    getDoctorPreviousRecords,
    deleteDoctorRecord
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/me/appointments/upcoming')
    .get(protect, authorize('doctor'), getDoctorUpcomingAppointments);

router.route('/me/appointments/assigned')
    .get(protect, authorize('doctor'), getDoctorAssignedPatients);

router.route('/record/:appointmentId')
    .post(protect, authorize('doctor'), createPatientRecord);

router.route('/me/records')
    .get(protect, authorize('doctor'), getDoctorPreviousRecords);

router.route('/me/records/:id')
    .delete(protect, authorize('doctor'), deleteDoctorRecord);

module.exports = router;
