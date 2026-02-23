const { verifyToken } = require('../config/jwt');
const { User } = require('../models');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authenticated. No token provided.' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] },
        });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User no longer exists.' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

module.exports = { protect };
