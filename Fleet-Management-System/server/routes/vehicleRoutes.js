const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getOne);
router.post('/', protect, authorize('manager'), ctrl.create);
router.put('/:id', protect, authorize('manager'), ctrl.update);
router.patch('/:id/status', protect, authorize('manager'), ctrl.updateStatus);
router.delete('/:id', protect, authorize('manager'), ctrl.remove);

module.exports = router;
