
const express = require('express');
const {
    bookAppointment,
    getPatientUpcomingAppointments,
    deleteAppointment,
    getAllDoctors
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();
router.route('/')
    .post(protect, authorize('patient'), bookAppointment);
router.route('/me/upcoming')
    .get(protect, authorize('patient'), getPatientUpcomingAppointments);
router.route('/:id')
    .delete(protect, authorize('patient'), deleteAppointment);
router.route('/doctors')
    .get(protect, authorize('patient'), getAllDoctors); 
module.exports = router;
