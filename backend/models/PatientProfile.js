
const mongoose = require('mongoose');

const patientProfileSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', 
            unique: true, 
        },
        dob: { 
            type: Date,
            required: false,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: false,
        },
        bloodGroup: {
            type: String,
            required: false,
        },
        emergencyContactName: {
            type: String,
            required: false,
        },
        emergencyContactNumber: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        
    },
    {
        timestamps: true, 
    }
);

const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);

module.exports = PatientProfile;
