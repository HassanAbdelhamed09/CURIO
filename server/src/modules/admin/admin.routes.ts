import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { role } from '../../middlewares/role.middleware.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(auth, role('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.patch('/users/:id', adminController.updateUser);
router.get('/sellers', adminController.getSellers);
router.get('/reviews', adminController.getReviews);
router.patch('/reviews/:id', adminController.updateReview);
router.delete('/reviews/:id', adminController.deleteReview);

export default router;
