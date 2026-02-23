const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getOne);
router.post('/', protect, authorize('manager', 'dispatcher'), ctrl.create);
router.patch('/:id/dispatch', protect, authorize('manager', 'dispatcher'), ctrl.dispatch);
router.patch('/:id/complete', protect, authorize('manager', 'dispatcher'), ctrl.complete);
router.patch('/:id/cancel', protect, authorize('manager', 'dispatcher'), ctrl.cancel);
router.delete('/:id', protect, authorize('manager'), ctrl.remove);

module.exports = router;
