import { http } from './http.js';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/auth.types.js';
import type { ApiResponse } from '../types/api.types.js';

export const authApi = {
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    const response = await http.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    const response = await http.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return response.data;
  },

  async googleLogin(credentialToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await http.post<ApiResponse<AuthResponse>>('/auth/google', { credentialToken });
    return response.data;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await http.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    const response = await http.get<ApiResponse<void>>(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  async resendVerification(email: string): Promise<ApiResponse<void>> {
    const response = await http.post<ApiResponse<void>>('/auth/resend-verification', { email });
    return response.data;
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const response = await http.post<ApiResponse<void>>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(payload: { token: string; passwordHash: string }): Promise<ApiResponse<void>> {
    // Note: backend expects { token, password }
    const response = await http.post<ApiResponse<void>>('/auth/reset-password', {
      token: payload.token,
      password: payload.passwordHash,
    });
    return response.data;
  },

  async changePassword(payload: { oldPass: string; newPass: string }): Promise<ApiResponse<void>> {
    const response = await http.post<ApiResponse<void>>('/auth/change-password', {
      oldPassword: payload.oldPass,
      newPassword: payload.newPass,
    });
    return response.data;
  },
};
export default authApi;
