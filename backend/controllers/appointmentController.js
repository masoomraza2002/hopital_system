
const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User'); 

const bookAppointment = asyncHandler(async (req, res) => {
    const { doctorId, date, time, disease } = req.body;
 
    if (!doctorId || !date || !time || !disease) {
        res.status(400);
        throw new Error('Please provide doctor, date, time, and disease.');
    }
 
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
        res.status(404);
        throw new Error('Selected doctor not found or is not a doctor.');
    }

     const existingPatientAppointment = await Appointment.findOne({
        patient: req.user._id,
        date: new Date(date),
        time,
        status: 'pending',
    });

    if (existingPatientAppointment) {
        res.status(400);
        throw new Error('You already have a pending appointment at this date and time.');
    }

    const existingDoctorAppointment = await Appointment.findOne({
        doctor: doctorId,
        date: new Date(date),
        time,
        status: 'pending',
    });

    if (existingDoctorAppointment) {
        res.status(400);
        throw new Error('Doctor is already booked at this date and time. Please choose another slot.');
    }
 
    const appointment = await Appointment.create({
        patient: req.user._id,
        doctor: doctorId,
        date: new Date(date),  
        time,
        disease,
        status: 'pending',
    });

    if (appointment) {
        res.status(201).json({
            message: 'Appointment booked successfully.',
            appointment,
        });
    } else {
        res.status(400);
        throw new Error('Failed to book appointment.');
    }
});
 
const getPatientUpcomingAppointments = asyncHandler(async (req, res) => { 
    const appointments = await Appointment.find({
        patient: req.user._id,
        status: 'pending',
        date: { $gte: new Date().setHours(0, 0, 0, 0) }  
    })
        .populate('doctor', 'name phoneNumber specialization')  
        .sort({ date: 1, time: 1 });  

    if (appointments) {
        res.status(200).json(appointments);
    } else {
        res.status(404);
        throw new Error('No upcoming appointments found for this patient.');
    }
}); 

const deleteAppointment = asyncHandler(async (req, res) => {
    const appointmentId = req.params.id;
 
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: req.user._id,
        status: 'pending', 
        date: { $gte: new Date() } 
    });

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found, already completed, or not authorized to delete.');
    }

    await Appointment.deleteOne({ _id: appointmentId }); 

    res.status(200).json({ message: 'Appointment deleted successfully.' });
});

const getAllDoctors = asyncHandler(async (req, res) => {
    
    const doctors = await User.find({ role: 'doctor' }).select('-password -email -role -createdAt -updatedAt'); 

    if (doctors) {
        res.status(200).json(doctors);
    } else {
        res.status(404);
        throw new Error('No doctors found.');
    }
});

module.exports = {
    bookAppointment,
    getPatientUpcomingAppointments,
    deleteAppointment,
    getAllDoctors,
};
