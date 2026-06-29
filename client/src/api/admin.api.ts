import { http } from './http.js';
import type { ApiResponse } from '../types/api.types.js';

export interface DashboardStats {
  customers: number;
  sellers: number;
  products: number;
  orders: number;
  revenue: number;
}

export interface MonthlyDataPoint {
  month: string;
  year: number;
  value: number;
}

export interface CategoryDataPoint {
  category: string;
  count: number;
}

export interface DashboardCharts {
  salesPerMonth: MonthlyDataPoint[];
  ordersPerMonth: MonthlyDataPoint[];
  productsPerCategory: CategoryDataPoint[];
}

export interface RecentOrder {
  _id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface RecentSeller {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface RecentProduct {
  _id: string;
  name: string;
  price: number;
  status: string;
  createdAt: string;
}

export interface DashboardRecent {
  orders: RecentOrder[];
  sellers: RecentSeller[];
  products: RecentProduct[];
}

export interface DashboardData {
  stats: DashboardStats;
  charts: DashboardCharts;
  recent: DashboardRecent;
}

export interface UserRegistryItem {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'seller' | 'admin';
  status: 'active' | 'blocked' | 'deleted';
  createdAt: string;
}

export interface PaginatedUsersData {
  users: UserRegistryItem[];
  total: number;
  pages: number;
  page: number;
}

export interface SellerRegistryItem {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: 'active' | 'blocked' | 'deleted';
  createdAt: string;
  productsCount: number;
}

export interface PaginatedSellersData {
  sellers: SellerRegistryItem[];
  total: number;
  pages: number;
  page: number;
}

export interface OrderItem {
  productId: {
    _id: string;
    name: string;
    images?: string[];
    seller?: {
      _id: string;
      fullName: string;
    };
  };
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderRegistryItem {
  _id: string;
  userId?: {
    _id: string;
    fullName: string;
    email: string;
  };
  guestId?: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  promoCode?: string;
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripeSessionId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'card' | 'cash';
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRegistryItem {
  _id: string;
  rating: number;
  comment: string;
  status: 'active' | 'hidden';
  createdAt: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  product: {
    _id: string;
    name: string;
    slug: string;
  };
}

export interface PaginatedReviewsData {
  reviews: ReviewRegistryItem[];
  total: number;
  pages: number;
  page: number;
}

export const adminApi = {
  async fetchDashboardData(): Promise<ApiResponse<DashboardData>> {
    const response = await http.get<ApiResponse<DashboardData>>('/admin/dashboard');
    return response.data;
  },

  async fetchUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<PaginatedUsersData>> {
    const response = await http.get<ApiResponse<PaginatedUsersData>>('/admin/users', { params });
    return response.data;
  },

  async fetchSellers(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedSellersData>> {
    const response = await http.get<ApiResponse<PaginatedSellersData>>('/admin/sellers', { params });
    return response.data;
  },

  async updateUser(
    id: string,
    payload: {
      fullName?: string;
      email?: string;
      phone?: string;
      role?: 'customer' | 'seller' | 'admin';
      status?: 'active' | 'blocked' | 'deleted';
    }
  ): Promise<ApiResponse<UserRegistryItem>> {
    const response = await http.patch<ApiResponse<UserRegistryItem>>(`/admin/users/${id}`, payload);
    return response.data;
  },

  async fetchOrders(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<OrderRegistryItem[]>> {
    const response = await http.get<ApiResponse<OrderRegistryItem[]>>('/orders', { params });
    return response.data;
  },

  async updateOrderStatus(
    id: string,
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  ): Promise<ApiResponse<OrderRegistryItem>> {
    const response = await http.patch<ApiResponse<OrderRegistryItem>>(`/orders/${id}/status`, { status });
    return response.data;
  },

  async fetchReviews(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedReviewsData>> {
    const response = await http.get<ApiResponse<PaginatedReviewsData>>('/admin/reviews', { params });
    return response.data;
  },

  async updateReview(
    id: string,
    payload: { status: 'active' | 'hidden' }
  ): Promise<ApiResponse<ReviewRegistryItem>> {
    const response = await http.patch<ApiResponse<ReviewRegistryItem>>(`/admin/reviews/${id}`, payload);
    return response.data;
  },

  async deleteReview(id: string): Promise<ApiResponse<null>> {
    const response = await http.delete<ApiResponse<null>>(`/admin/reviews/${id}`);
    return response.data;
  },
};

export default adminApi;
