require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;

function generateToken(userData) {
    const options = {
        expiresIn: '1hr'
    }
    return jwt.sign(userData, secretKey, options);
}

module.exports = { generateToken };