import { Router } from 'express';
import {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', listEvents);
router.post('/', authenticate, requireRole(['admin', 'editor']), createEvent);
router.patch('/:id', authenticate, requireRole(['admin', 'editor']), updateEvent);
router.delete('/:id', authenticate, requireRole(['admin', 'editor']), deleteEvent);

export default router;
