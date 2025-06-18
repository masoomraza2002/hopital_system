
const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Record = require('../models/Record');
const User = require('../models/User'); 

const getDoctorUpcomingAppointments = asyncHandler(async (req, res) => {
    
    const appointments = await Appointment.find({
        doctor: req.user._id,
        status: 'pending',
        isRecorded: false, 
        date: { $gte: new Date().setHours(0, 0, 0, 0) } 
    })
        .populate('patient', 'name phoneNumber') 
        .sort({ date: 1, time: 1 }); 

    if (appointments) {
        res.status(200).json(appointments);
    } else {
        res.status(404);
        throw new Error('No upcoming appointments found.');
    }
});

const getDoctorAssignedPatients = asyncHandler(async (req, res) => {
    
    const assignedAppointments = await Appointment.find({
        doctor: req.user._id,
        status: 'completed',
        isRecorded: true, 
    })
        .populate('patient', 'name phoneNumber') 
        .sort({ date: -1, time: -1 });   
    
    const appointmentsNeedingRecord = await Appointment.find({
        doctor: req.user._id,
        status: 'pending', 
        isRecorded: false,
    })
        .populate('patient', 'name phoneNumber')
        .sort({ date: 1, time: 1 });
    res.status(200).json(appointmentsNeedingRecord);
});

const createPatientRecord = asyncHandler(async (req, res) => {
    const { medicinesPrescribed, diseaseDescription, doctorAdvice } = req.body;
    const { appointmentId } = req.params;

    if (!medicinesPrescribed || !diseaseDescription || !doctorAdvice) {
        res.status(400);
        throw new Error('Please fill all fields for the record.');
    } 
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        doctor: req.user._id,
        status: 'pending', 
        isRecorded: false,
    });

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found or not authorized to record this appointment.');
    }

    const record = await Record.create({
        appointment: appointment._id,
        patient: appointment.patient,
        doctor: req.user._id,
        diseaseDescription,
        medicinesPrescribed,
        doctorAdvice,
    });

    if (record) {
        
        appointment.status = 'completed';
        appointment.isRecorded = true;
        await appointment.save();
        res.status(201).json({
            message: 'Medical record saved successfully and appointment closed.',
            record,
            appointmentStatus: appointment.status,
        });
    } else {
        res.status(400);
        throw new Error('Failed to create medical record.');
    }
});

const getDoctorPreviousRecords = asyncHandler(async (req, res) => {    
    const records = await Record.find({ doctor: req.user._id })
        .populate({
            path: 'appointment',
            select: 'date time disease',
        })
        .populate({
            path: 'patient', 
            select: 'name phoneNumber',
        })
        .sort({ 'appointment.date': -1 }); 

    if (records) {
        res.status(200).json(records);
    } else {
        res.status(404);
        throw new Error('No previous records found for this doctor.');
    }
});

const deleteDoctorRecord = asyncHandler(async (req, res) => {
    const recordId = req.params.id;
   
    const record = await Record.findOne({ _id: recordId, doctor: req.user._id });

    if (!record) {
        res.status(404);
        throw new Error('Record not found or not authorized to delete this record.');
    }
    
    const appointment = await Appointment.findById(record.appointment);

    if (appointment) {
        appointment.isRecorded = false; 
        appointment.status = 'pending'; 
        await appointment.save();
    }

    await Record.deleteOne({ _id: recordId }); 

    res.status(200).json({ message: 'Record deleted successfully and appointment status updated.' });
});


module.exports = {
    getDoctorUpcomingAppointments,
    getDoctorAssignedPatients,
    createPatientRecord,
    getDoctorPreviousRecords,
    deleteDoctorRecord,
};
