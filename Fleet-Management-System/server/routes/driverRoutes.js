const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getOne);
router.post('/', protect, authorize('manager', 'safety_officer'), ctrl.create);
router.put('/:id', protect, authorize('manager', 'safety_officer'), ctrl.update);
router.patch('/:id/status', protect, authorize('manager', 'safety_officer'), ctrl.updateStatus);
router.delete('/:id', protect, authorize('manager'), ctrl.remove);

module.exports = router;
