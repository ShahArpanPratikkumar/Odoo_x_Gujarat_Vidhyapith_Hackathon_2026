const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehicle = sequelize.define('Vehicle', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    license_plate: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: {
        type: DataTypes.ENUM('truck', 'van', 'bike'),
        allowNull: false,
        defaultValue: 'van',
    },
    max_capacity_kg: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 500 },
    odometer_km: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: {
        type: DataTypes.ENUM('available', 'on_trip', 'in_shop', 'retired'),
        defaultValue: 'available',
    },
    acquisition_cost: { type: DataTypes.FLOAT, defaultValue: 0 },
    region: { type: DataTypes.STRING, defaultValue: 'Gujarat' },
    make: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    year: { type: DataTypes.INTEGER },
    fuel_type: { type: DataTypes.STRING, defaultValue: 'Diesel' },
    notes: { type: DataTypes.TEXT },
}, { tableName: 'vehicles', timestamps: true });

module.exports = Vehicle;
