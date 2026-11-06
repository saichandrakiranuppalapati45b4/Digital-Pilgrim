import { Router } from 'express';
import {
  listFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} from '../controllers/facilityController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', listFacilities);
router.get('/:id', getFacilityById);
router.post('/', authenticate, requireRole(['admin', 'editor']), createFacility);
router.patch('/:id', authenticate, requireRole(['admin', 'editor']), updateFacility);
router.delete('/:id', authenticate, requireRole(['admin', 'editor']), deleteFacility);

export default router;
