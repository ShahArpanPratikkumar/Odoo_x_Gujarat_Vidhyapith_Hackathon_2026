const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/fuelController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, ctrl.getAll);
router.get('/vehicle/:vehicleId', protect, ctrl.getByVehicle);
router.post('/', protect, authorize('manager', 'dispatcher'), ctrl.create);
router.delete('/:id', protect, authorize('manager'), ctrl.remove);

module.exports = router;
