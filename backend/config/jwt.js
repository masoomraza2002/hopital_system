// backend/config/jwt.js 
const jwt = require('jsonwebtoken');
 
const generateToken = (id, role) => { 
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

module.exports = generateToken;
