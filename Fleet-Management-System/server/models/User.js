const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Fleet User' },
    role: {
        type: DataTypes.ENUM('manager', 'dispatcher', 'safety_officer', 'analyst'),
        allowNull: false,
        defaultValue: 'dispatcher',
    },
}, { tableName: 'users', timestamps: true });

module.exports = User;
