import { Router, Request, Response, NextFunction } from 'express';
import {
  listHeritage,
  getFeaturedHeritage,
  getHeritageBySlug,
  createHeritage,
  updateHeritage,
  deleteHeritage,
} from '../controllers/heritageController';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';

const router = Router();

// Optional authentication middleware for public endpoints to let logged-in admins see drafts
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
    // Ignore error for optional auth
  }
  next();
};

router.get('/', optionalAuthenticate, listHeritage);
router.get('/featured', getFeaturedHeritage);
router.get('/:slug', optionalAuthenticate, getHeritageBySlug);

// Admin / Editor protected routes
router.post('/', authenticate, requireRole(['admin', 'editor']), createHeritage);
router.patch('/:id', authenticate, requireRole(['admin', 'editor']), updateHeritage);
router.delete('/:id', authenticate, requireRole(['admin', 'editor']), deleteHeritage);

export default router;
