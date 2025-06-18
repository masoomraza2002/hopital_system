
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const DoctorProfile = require('../models/DoctorProfile');
const generateToken = require('../config/jwt');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, phoneNumber, specialization } = req.body;

    if (!name || !email || !password || !role || !phoneNumber) {
        res.status(400);
        throw new Error('Please enter all required fields.');
    }
    
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User with this email already exists.');
    }
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
        res.status(400);
        throw new Error('User with this phone number already exists.');
    }
    if (role === 'doctor' && !specialization) {
        res.status(400);
        throw new Error('Please provide specialization for doctor registration.');
    }
    
    const user = await User.create({
        name,
        email,
        password,
        role,
        phoneNumber,
        specialization: role === 'doctor' ? specialization : undefined, 
    });

    if (user) {
        
        if (user.role === 'patient') {
            await PatientProfile.create({ user: user._id });
        } else if (user.role === 'doctor') {
            await DoctorProfile.create({ user: user._id });
        }
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            specialization: user.specialization,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data.');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
        res.status(400);
        throw new Error('Please enter email, password, and role.');
    }
    
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
        if (user.role !== role) {
            res.status(401);
            throw new Error(`Role mismatch. You are registered as a ${user.role}.`);
        }
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            specialization: user.specialization,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(401); 
        throw new Error('Invalid credentials or role.');
    }
});

module.exports = { registerUser, loginUser };
