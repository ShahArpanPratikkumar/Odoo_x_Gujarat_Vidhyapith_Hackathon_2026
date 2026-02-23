require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');


const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const driverRoutes = require('./routes/driverRoutes');
const tripRoutes = require('./routes/tripRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const fuelRoutes = require('./routes/fuelRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();


app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), service: 'Transvora Fleet API' });
});


app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/reports', reportRoutes);


app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        
        await sequelize.sync({ alter: true });
        console.log('✅ Models synced');

        app.listen(PORT, () => {
            console.log(`🚀 Transvora API running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Startup error:', err.message);
        process.exit(1);
    }
};

start();
