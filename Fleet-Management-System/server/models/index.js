const sequelize = require('../config/db');
const User = require('./User');
const Vehicle = require('./Vehicle');
const Driver = require('./Driver');
const Trip = require('./Trip');
const Maintenance = require('./Maintenance');
const FuelLog = require('./FuelLog');




Trip.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
Trip.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' });
Trip.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Vehicle.hasMany(Trip, { foreignKey: 'vehicle_id', as: 'trips' });
Driver.hasMany(Trip, { foreignKey: 'driver_id', as: 'trips' });


Maintenance.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
Vehicle.hasMany(Maintenance, { foreignKey: 'vehicle_id', as: 'maintenanceLogs' });


FuelLog.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
FuelLog.belongsTo(Trip, { foreignKey: 'trip_id', as: 'trip' });
Vehicle.hasMany(FuelLog, { foreignKey: 'vehicle_id', as: 'fuelLogs' });
Trip.hasMany(FuelLog, { foreignKey: 'trip_id', as: 'fuelLogs' });

module.exports = { sequelize, User, Vehicle, Driver, Trip, Maintenance, FuelLog };
