import { http } from './http.js';
import type { Wishlist } from '../types/wishlist.types.js';
import type { ApiResponse } from '../types/api.types.js';

export const wishlistApi = {
  async getWishlist(): Promise<ApiResponse<Wishlist>> {
    const response = await http.get<ApiResponse<Wishlist>>('/wishlist');
    return response.data;
  },

  async addToWishlist(productId: string): Promise<ApiResponse<Wishlist>> {
    const response = await http.post<ApiResponse<Wishlist>>(`/wishlist/${productId}`);
    return response.data;
  },

  async removeFromWishlist(productId: string): Promise<ApiResponse<Wishlist>> {
    const response = await http.delete<ApiResponse<Wishlist>>(`/wishlist/${productId}`);
    return response.data;
  },

  async clearWishlist(): Promise<ApiResponse<Wishlist>> {
    const response = await http.delete<ApiResponse<Wishlist>>('/wishlist');
    return response.data;
  },
};
export default wishlistApi;
