
const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Record = require('../models/Record');
const User = require('../models/User'); 

const getPatientPreviousRecords = asyncHandler(async (req, res) => {
   
    const records = await Record.find({ patient: req.user._id })
        .populate({
            path: 'appointment', 
            select: 'date time disease', 
        })
        .populate({
            path: 'doctor', 
            select: 'name phoneNumber specialization', 
        })
        .sort({ 'appointment.date': -1 }); 

    if (records) {
        res.status(200).json(records);
    } else {
        res.status(404);
        throw new Error('No records found for this patient.');
    }
});

const deletePatientPreviousRecord = asyncHandler(async (req, res) => {
    const recordId = req.params.id;
   
    const record = await Record.findOne({ _id: recordId, patient: req.user._id });

    if (!record) {
        res.status(404);
        throw new Error('Record not found or not authorized to delete this record.');
    }
    
    const appointment = await Appointment.findById(record.appointment);

    if (!appointment) {
        res.status(404);
        throw new Error('Associated appointment not found.');
    }
    
    await Record.deleteOne({ _id: recordId });  
        
    appointment.isRecorded = false; 
    await appointment.save();
    res.status(200).json({ message: 'Record and associated appointment status updated successfully.' });
});

module.exports = {
    getPatientPreviousRecords,
    deletePatientPreviousRecord,
};
