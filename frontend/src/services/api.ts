/**
 * API service for gulfvista.properties frontend
 * Handles all HTTP requests to the backend API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  User,
  AuthTokens,
  Property,
  PropertyListResponse,
  PropertyFilters,
  LoginRequest,
  RegisterRequest,
  PropertyCreateRequest,
  CreateCheckoutSessionRequest,
  CheckoutSessionResponse,
  LeadCreateRequest,
  Lead,
} from '@/types';

// ============================================================================
// API Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_V1_URL = `${API_BASE_URL}/api/v1`;

// ============================================================================
// API Service Class
// ============================================================================

class ApiService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_V1_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load tokens from localStorage
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && this.refreshToken && !originalRequest?.retried) {
          originalRequest!.retried = true;

          try {
            // Attempt token refresh
            const response = await this.refreshAccessToken();
            this.setTokens(response.access_token, response.refresh_token);

            // Retry original request
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearTokens();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // =========================================================================
  // Token Management
  // =========================================================================

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private async refreshAccessToken(): Promise<AuthTokens> {
    const response = await this.client.post('/auth/refresh', {
      refresh_token: this.refreshToken,
    });
    return response.data;
  }

  // =========================================================================
  // Authentication Endpoints
  // =========================================================================

  async login(credentials: LoginRequest): Promise<AuthTokens> {
    const response = await this.client.post<AuthTokens>('/auth/login', credentials);
    this.setTokens(response.data.access_token, response.data.refresh_token);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await this.client.post<User>('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  // =========================================================================
  // Properties Endpoints
  // =========================================================================

  async listProperties(filters?: PropertyFilters): Promise<PropertyListResponse> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.skip) params.append('skip', filters.skip.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.property_type) params.append('property_type', filters.property_type);
      if (filters.min_price) params.append('min_price', filters.min_price.toString());
      if (filters.max_price) params.append('max_price', filters.max_price.toString());
      if (filters.city) params.append('city', filters.city);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    }

    const response = await this.client.get<PropertyListResponse>('/properties', {
      params: Object.fromEntries(params),
    });

    return response.data;
  }

  async getPropertyDetail(propertyId: number): Promise<Property> {
    const response = await this.client.get<Property>(`/properties/${propertyId}`);
    return response.data;
  }

  async createProperty(propertyData: PropertyCreateRequest): Promise<Property> {
    const response = await this.client.post<Property>('/properties', propertyData);
    return response.data;
  }

  async updateProperty(
    propertyId: number,
    updates: Partial<PropertyCreateRequest>
  ): Promise<Property> {
    const response = await this.client.put<Property>(`/properties/${propertyId}`, updates);
    return response.data;
  }

  async deleteProperty(propertyId: number): Promise<void> {
    await this.client.delete(`/properties/${propertyId}`);
  }

  // =========================================================================
  // Payment Endpoints
  // =========================================================================

  async createCheckoutSession(
    request: CreateCheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> {
    const response = await this.client.post<CheckoutSessionResponse>(
      '/payments/create-checkout-session',
      request
    );
    return response.data;
  }

  // =========================================================================
  // Lead Endpoints
  // =========================================================================

  async submitLead(leadData: LeadCreateRequest): Promise<Lead> {
    const response = await this.client.post<Lead>('/leads', leadData);
    return response.data;
  }

  async getLeads(): Promise<Lead[]> {
    const response = await this.client.get<Lead[]>('/leads');
    return response.data;
  }

  // =========================================================================
  // Error Handling
  // =========================================================================

  getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.detail || error.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const apiService = new ApiService();
export default apiService;
