import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createChair,
  getChairsByBranch,
  getChairById,
  updateChair,
  deleteChair,
  getChairAvailability,
} from '../controllers/chair.controller.js';

import {
  createChair as createValidation,
  updateChair as updateValidation,
} from '../validators/chair.validator.js';

const router = express.Router();
//done
router.get('/branch/:branchId', authenticate, getChairsByBranch);
router.get('/:id', authenticate, getChairById);
router.get('/:id/availability', authenticate, getChairAvailability);

router.post('/create-chair', authenticate, authorize(['admin']), validate(createValidation), createChair);
router.put('/:id', authenticate, authorize(['admin']), validate(updateValidation), updateChair);
router.delete('/:id', authenticate, authorize(['admin']), deleteChair);

export default router;