const authService = require('../services/authService');

const signup = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        
        const user = await authService.signup({ email, password, name });
        res.status(201).json({ success: true, data: user, message: 'Signup successful' });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Missing email or password' });
        }
        
        const data = await authService.login(email, password);
        res.status(200).json({ success: true, data, message: 'Login successful' });
    } catch (error) {
        next(error);
    }
};

const requestOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Missing email' });
        }
        
        await authService.requestOtp(email);
        res.status(200).json({ success: true, message: 'OTP sent if email exists' });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        
        await authService.resetPassword(email, otp, newPassword);
        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    login,
    requestOtp,
    resetPassword
};
