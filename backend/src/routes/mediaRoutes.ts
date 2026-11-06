import { Router } from 'express';
import { getUploadSignature, deleteMedia } from '../controllers/mediaController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/signature',
  authenticate,
  requireRole(['admin', 'editor']),
  getUploadSignature
);

router.delete(
  '/:publicId',
  authenticate,
  requireRole(['admin', 'editor']),
  deleteMedia
);

export default router;
