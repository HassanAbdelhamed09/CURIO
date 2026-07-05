import { Router } from 'express';
import { marketingController } from './marketing.controller.js';

const router = Router();

// Subscribe route
router.post('/subscribe', marketingController.subscribe);

export default router;
