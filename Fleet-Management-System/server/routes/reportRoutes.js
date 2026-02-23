const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/dashboard', protect, ctrl.getDashboard);
router.get('/vehicle/:id/roi', protect, authorize('manager', 'analyst'), ctrl.getVehicleROIReport);
router.get('/fuel-efficiency', protect, authorize('manager', 'analyst'), ctrl.getFuelEfficiencyReport);
router.get('/costs', protect, authorize('manager', 'analyst'), ctrl.getCostReport);
router.get('/driver-performance', protect, authorize('manager', 'safety_officer', 'analyst'), ctrl.getDriverPerformance);
router.get('/export/csv', protect, authorize('manager', 'analyst'), ctrl.exportCSV);

module.exports = router;
