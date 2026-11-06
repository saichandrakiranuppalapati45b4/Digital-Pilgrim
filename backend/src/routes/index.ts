import { Router } from 'express';
import authRoutes from './authRoutes';
import heritageRoutes from './heritageRoutes';
import eventRoutes from './eventRoutes';
import announcementRoutes from './announcementRoutes';
import facilityRoutes from './facilityRoutes';
import mediaRoutes from './mediaRoutes';
import qrRoutes from './qrRoutes';
import healthRoutes from './healthRoutes';
import statsRoutes from './statsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/heritage', heritageRoutes);
router.use('/events', eventRoutes);
router.use('/announcements', announcementRoutes);
router.use('/facilities', facilityRoutes);
router.use('/media', mediaRoutes);
router.use('/qr', qrRoutes);
router.use('/health', healthRoutes);
router.use('/stats', statsRoutes);

export default router;
