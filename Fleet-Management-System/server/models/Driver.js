const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Driver = sequelize.define('Driver', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING },
    license_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    license_expiry: { type: DataTypes.DATEONLY, allowNull: false },
    license_category: {
        type: DataTypes.ENUM('truck', 'van', 'bike'),
        allowNull: false,
        defaultValue: 'van',
    },
    status: {
        type: DataTypes.ENUM('available', 'on_trip', 'suspended', 'off_duty'),
        defaultValue: 'available',
    },
    safety_score: { type: DataTypes.FLOAT, defaultValue: 100 },
    trips_completed: { type: DataTypes.INTEGER, defaultValue: 0 },
    trips_total: { type: DataTypes.INTEGER, defaultValue: 0 },
    joining_date: { type: DataTypes.DATEONLY },
    address: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT },
}, { tableName: 'drivers', timestamps: true });

module.exports = Driver;
