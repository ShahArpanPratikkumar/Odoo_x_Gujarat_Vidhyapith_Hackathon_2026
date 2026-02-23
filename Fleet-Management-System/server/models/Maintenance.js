const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Maintenance = sequelize.define('Maintenance', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type: { type: DataTypes.STRING, allowNull: false },  
    technician: { type: DataTypes.STRING },
    cost: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: {
        type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'overdue'),
        defaultValue: 'scheduled',
    },
    priority: {
        type: DataTypes.ENUM('normal', 'high', 'critical'),
        defaultValue: 'normal',
    },
    scheduled_date: { type: DataTypes.DATEONLY, allowNull: false },
    completed_date: { type: DataTypes.DATEONLY },
    notes: { type: DataTypes.TEXT },

    vehicle_id: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'maintenance_logs', timestamps: true });

module.exports = Maintenance;
