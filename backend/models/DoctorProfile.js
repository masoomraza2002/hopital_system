
const mongoose = require('mongoose');

const doctorProfileSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', 
            unique: true, 
        },        
        qualifications: {
            type: [String], 
            default: [],
        },
        experienceYears: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, 
    }
);

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);

module.exports = DoctorProfile;
