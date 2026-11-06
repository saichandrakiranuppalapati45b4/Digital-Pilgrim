import { Router } from 'express';
import { getQRByLocationId } from '../controllers/qrController';

const router = Router();

router.get('/:locationId', getQRByLocationId);

export default router;
