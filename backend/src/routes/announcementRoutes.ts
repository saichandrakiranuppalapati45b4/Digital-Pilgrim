import { Router, Request, Response, NextFunction } from 'express';
import {
  listAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';

const router = Router();

const optionalAuthenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch {
    // Ignore error
  }
  next();
};

router.get('/', optionalAuthenticate, listAnnouncements);
router.post('/', authenticate, requireRole(['admin', 'editor']), createAnnouncement);
router.patch('/:id', authenticate, requireRole(['admin', 'editor']), updateAnnouncement);
router.delete('/:id', authenticate, requireRole(['admin', 'editor']), deleteAnnouncement);

export default router;
