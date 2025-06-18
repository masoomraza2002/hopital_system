// backend/routes/patientRoutes.js
const express = require('express');
const { getPatientPreviousRecords, deletePatientPreviousRecord } = require('../controllers/patientController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();
 
router.route('/me/records')
    .get(protect, authorize('patient'), getPatientPreviousRecords);
 
router.route('/me/records/:id')
    .delete(protect, authorize('patient'), deletePatientPreviousRecord);

module.exports = router;
