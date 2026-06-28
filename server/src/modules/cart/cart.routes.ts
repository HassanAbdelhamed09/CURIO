import { Router } from 'express';
import { cartController } from './cart.controller.js';
import { orderController } from './order.controller.js';
import { resolveCartOwner } from '../../middlewares/resolveCartOwner.middleware.js';

const cartRouter = Router();
const checkoutRouter = Router();
const orderRouter = Router();

// Apply resolveCartOwner middleware to all routes
cartRouter.use(resolveCartOwner);
checkoutRouter.use(resolveCartOwner);
orderRouter.use(resolveCartOwner);

// Cart Routes
cartRouter.get('/', cartController.getCart);
cartRouter.post('/items', cartController.addItem);
cartRouter.patch('/items/:itemId', cartController.updateItem);
cartRouter.delete('/items/:itemId', cartController.removeItem);
cartRouter.delete('/', cartController.clearCart);
cartRouter.post('/promo', cartController.applyPromo);
cartRouter.delete('/promo', cartController.removePromo);

// Checkout Route
checkoutRouter.post('/', orderController.checkout);

// Orders Route
orderRouter.get('/:id', orderController.getOrderById);

export { cartRouter, checkoutRouter, orderRouter };
