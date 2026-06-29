import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { cartService } from './cart.service.js';
import { PromoCode } from './promo.model.js';

export class CartController {
  /**
   * GET /api/cart
   */
  public getCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.cartOwner?.userId;
    const guestId = req.cartOwner?.guestId;

    const cart = await cartService.getOrCreateCart(userId, guestId);
    const data = await cartService.getPopulatedCartWithTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully.',
      data,
    });
  });

  /**
   * POST /api/cart/items
   */
  public addItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.cartOwner?.userId;
    const guestId = req.cartOwner?.guestId;
    const { productId, quantity } = req.body;

    const qty = parseInt(quantity, 10);
    const cart = await cartService.addItem(productId, qty, userId, guestId);
    const data = await cartService.getPopulatedCartWithTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully.',
      data,
    });
  });

  /**
   * PATCH /api/cart/items/:itemId
   */
  public updateItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.cartOwner?.userId;
    const guestId = req.cartOwner?.guestId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    const cart = await cartService.updateItem(itemId, qty, userId, guestId);
    const data = await cartService.getPopulatedCartWithTotals(cart);

    res.status(200).json({
      success: true,
      message: qty === 0 ? 'Item removed from cart.' : 'Cart item quantity updated.',
      data,
    });
  });

  /**
   * DELETE /api/cart/items/:itemId
   */
  public removeItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.cartOwner?.userId;
    const guestId = req.cartOwner?.guestId;
    const { itemId } = req.params;

    const cart = await cartService.removeItem(itemId, userId, guestId);
    const data = await cartService.getPopulatedCartWithTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully.',
      data,
    });
  });

  /**
   * DELETE /api/cart
   */
  public clearCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.cartOwner?.userId;
    const guestId = req.cartOwner?.guestId;

    const cart = await cartService.clearCart(userId, guestId);
    const data = await cartService.getPopulatedCartWithTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully.',
      data,
    });
  });

  /**
   * POST /api/cart/promo
   */
  public applyPromo = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.cartOwner?.userId;
    const guestId = req.cartOwner?.guestId;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required.',
      });
    }

    const cart = await cartService.applyPromo(code, userId, guestId);
    const data = await cartService.getPopulatedCartWithTotals(cart);

    res.status(200).json({
      success: true,
      message: `Promo code "${code.toUpperCase()}" applied successfully.`,
      data,
    });
  });

  /**
   * DELETE /api/cart/promo
   */
  public removePromo = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.cartOwner?.userId;
    const guestId = req.cartOwner?.guestId;

    const cart = await cartService.removePromo(userId, guestId);
    const data = await cartService.getPopulatedCartWithTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Promo code removed successfully.',
      data,
    });
  });

  /**
   * GET /api/cart/active-promos
   * Returns a list of active promo codes for customer presentation.
   */
  public getActivePromos = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await PromoCode.find({
      isActive: true,
      $or: [
        { expirationDate: { $exists: false } },
        { expirationDate: null },
        { expirationDate: { $gt: new Date() } }
      ]
    })
      .select('code discountType discountValue usageLimit usedCount')
      .limit(3);

    // Keep only codes that haven't hit their usageLimit
    const filtered = data.filter(
      p => p.usageLimit === undefined || p.usedCount < p.usageLimit
    );

    res.status(200).json({
      success: true,
      message: 'Active promo codes retrieved successfully.',
      data: filtered,
    });
  });
}

export const cartController = new CartController();
export default cartController;
