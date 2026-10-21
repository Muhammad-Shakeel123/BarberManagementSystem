import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  addToQueue,
  getQueueStatus,
  getMyQueueStatus,
  leaveQueue,
  assignNext,
} from '../controllers/queue.controller.js';

import {
  addToQueue as addValidation,
  assignNext as assignValidation,
} from '../validators/queue.validator.js';

const router = express.Router();

router.post('/', authenticate, validate(addValidation), addToQueue);
router.get('/branch/:branchId', authenticate, getQueueStatus);
router.get('/my-status', authenticate, getMyQueueStatus);
router.delete('/:id', authenticate, leaveQueue);

// Barber/Admin: assign next
router.post('/assign', authenticate, authorize(['barber', 'admin']), validate(assignValidation), assignNext);

export default router;