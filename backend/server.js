
const express = require('express');
const dotenv = require('dotenv').config(); 
const cors = require('cors'); 
const connectDB = require('./config/db'); 
const { errorHandler } = require('./middlewares/errorHandler'); 

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
