import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, requireRole(['admin', 'editor']), getDashboardStats);

export default router;
