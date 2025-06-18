
const mongoose = require('mongoose');

const recordSchema = mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Appointment', 
            unique: true, 
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', 
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', 
        },
        diseaseDescription: {
            type: String,
            required: true,
        },
        medicinesPrescribed: {
            type: String, 
            default: '',
        },
        doctorAdvice: {
            type: String, 
            default: '',
        },        
    },
    {
        timestamps: true, 
    }
);

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
