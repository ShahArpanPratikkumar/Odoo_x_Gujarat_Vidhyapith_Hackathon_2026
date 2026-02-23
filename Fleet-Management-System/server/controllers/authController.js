const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken } = require('../config/jwt');
const { validate } = require('../utils/validators');


const register = async (req, res, next) => {
    try {
        const { error, value } = validate('register', req.body);
        if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });

        const existing = await User.findOne({ where: { email: value.email } });
        if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(value.password, salt);

        const user = await User.create({ ...value, password: hashed });
        const token = signToken({ id: user.id, role: user.role });

        res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) { next(err); }
};


const login = async (req, res, next) => {
    try {
        const { error, value } = validate('login', req.body);
        if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });

        const user = await User.findOne({ where: { email: value.email } });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

        const match = await bcrypt.compare(value.password, user.password);
        if (!match) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

        const token = signToken({ id: user.id, role: user.role });

        res.json({
            success: true,
            message: 'Login successful.',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) { next(err); }
};


const getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};


const seed = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const defaultUsers = [
            { name: 'Fleet Manager', email: 'manager12@gmail.com', role: 'manager', password: await bcrypt.hash('password123', salt) },
            { name: 'Dispatcher', email: 'dispatcher@transvora.in', role: 'dispatcher', password: await bcrypt.hash('password123', salt) },
            { name: 'Safety Officer', email: 'safety@transvora.in', role: 'safety_officer', password: await bcrypt.hash('password123', salt) },
            { name: 'Analyst', email: 'analyst@transvora.in', role: 'analyst', password: await bcrypt.hash('password123', salt) },
        ];
        for (const u of defaultUsers) {
            await User.findOrCreate({ where: { email: u.email }, defaults: u });
        }
        res.json({ success: true, message: 'Default users seeded.', logins: defaultUsers.map(u => ({ email: u.email, password: 'password123', role: u.role })) });
    } catch (err) { next(err); }
};

module.exports = { register, login, getMe, seed };
