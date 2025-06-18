// backend/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
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
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String, 
            required: true,
        },
        disease: {
            type: String, 
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'], 
            default: 'pending',
        },        
        isRecorded: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, 
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
