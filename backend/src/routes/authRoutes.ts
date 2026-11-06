import { Router } from 'express';
import { login, logout, me, refresh } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticate, me);
router.post('/refresh', authenticate, refresh);

export default router;
