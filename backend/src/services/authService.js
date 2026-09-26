const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Member 3 (DB owner) should provide the User model.
// This is the contract we expect.
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

const signup = async (userData) => {
    // Validate uniqueness, hash password
    const { email, password, name } = userData;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        const error = new Error('User already exists');
        error.status = 400;
        throw error;
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,
        email,
        passwordHash,
        role: 'user' // default role
    });
    
    return { id: newUser.id, name: newUser.name, email: newUser.email };
};

const login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

const requestOtp = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        // Return success even if user doesn't exist to prevent email enumeration
        return true;
    }
    
    // In a real scenario, generate OTP, save to DB with expiry, and send email.
    // Member 3 will need to add OTP fields to User model or an OTP model.
    // For now, we mock success.
    return true;
};

const resetPassword = async (email, otp, newPassword) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const error = new Error('Invalid request');
        error.status = 400;
        throw error;
    }
    
    // Verify OTP logic goes here based on DB implementation
    // Mocking OTP verification for now
    if (otp !== '123456') { // Mock condition
        const error = new Error('Invalid OTP');
        error.status = 400;
        throw error;
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash });
    
    return true;
};

module.exports = {
    signup,
    login,
    requestOtp,
    resetPassword
};
