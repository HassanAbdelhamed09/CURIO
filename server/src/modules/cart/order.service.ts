import { Types } from 'mongoose';
import { ApiError } from '../../utils/ApiError.js';
import { Order, IOrder, IShippingAddress } from './order.model.js';
import { Product } from '../products/product.model.js';
import { cartService } from './cart.service.js';

export class OrderService {
  /**
   * Processes cart checkout and creates an Order.
   */
  public async checkout(
    shippingAddress: IShippingAddress,
    userId?: string,
    guestId?: string
  ): Promise<IOrder> {
    // 1. Retrieve current cart
    const cart = await cartService.getOrCreateCart(userId, guestId);
    if (cart.items.length === 0) {
      throw new ApiError(400, 'Cannot place order. Your shopping cart is empty.', 'EMPTY_CART');
    }

    // 2. Populate and compute totals (also validates applied promo codes)
    const { cart: populatedCart, totals } = await cartService.getPopulatedCartWithTotals(cart);

    // 3. Verify stock and build snapshot order items
    const orderItems: any[] = [];
    
    for (const item of populatedCart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) {
        throw new ApiError(
          404,
          `Product "${item.productId.name}" no longer exists in our registry.`,
          'PRODUCT_NOT_FOUND'
        );
      }

      if (product.status !== 'active') {
        throw new ApiError(
          400,
          `Product "${product.name}" is no longer available.`,
          'PRODUCT_UNAVAILABLE'
        );
      }

      if (product.stock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for "${product.name}". Requested: ${item.quantity}, Available: ${product.stock}`,
          'INSUFFICIENT_STOCK'
        );
      }

      // Add to order items array (snapshotting details)
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : undefined,
      });
    }

    // 4. Create Order document
    const orderData: any = {
      items: orderItems,
      shippingAddress,
      totals,
      status: 'pending',
    };

    if (userId) {
      orderData.userId = new Types.ObjectId(userId);
    } else if (guestId) {
      orderData.guestId = guestId;
    }

    if (cart.promoCode) {
      orderData.promoCode = cart.promoCode;
    }

    const order = await Order.create(orderData);

    // 5. Decrement product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // 6. Clear cart items
    await cartService.clearCart(userId, guestId);

    return order;
  }

  /**
   * Retrieves order by ID with secure authorization checks.
   */
  public async getOrderById(
    orderId: string,
    requestingUser?: { _id: string; role: string },
    requestingGuestId?: string
  ): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found.', 'ORDER_NOT_FOUND');
    }

    // Bypass check for admins or sellers
    if (requestingUser && (requestingUser.role === 'admin' || requestingUser.role === 'seller')) {
      return order;
    }

    // Check ownership
    if (order.userId) {
      if (!requestingUser || order.userId.toString() !== requestingUser._id.toString()) {
        throw new ApiError(403, 'Access denied. You do not own this order.', 'ACCESS_DENIED');
      }
    } else if (order.guestId) {
      if (!requestingGuestId || order.guestId !== requestingGuestId) {
        throw new ApiError(403, 'Access denied. Guest identifier does not match this order.', 'ACCESS_DENIED');
      }
    } else {
      throw new ApiError(403, 'Access denied. Order cannot be verified.', 'ACCESS_DENIED');
    }

    return order;
  }
}

export const orderService = new OrderService();
export default orderService;
