import axios, { AxiosInstance } from 'axios';
import { getUserId } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bush.uz';

// Types based on the actual API documentation from http://77.93.152.199:8088/docs

/**
 * GET /api/users/{user_id_string}/balance
 * Response structure
 */
export interface Balance {
  user_id_string: string;
  balance: number;
}

/**
 * GET /api/users/{user_id_string}/history
 * Response structure - array of history items
 */
export interface HistoryItem {
  item_name: string;
  location_name: string;
  points_awarded: number;
  date: string; // ISO 8601 format
}

/**
 * GET /api/locations
 * Response structure - array of locations
 */
export interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * GET /api/catalog
 * Response structure - array of catalog items
 */
export interface CatalogItem {
  item_sku: string;
  name: string;
  description: string;
  points_awarded: number;
}

/**
 * POST /api/returns
 * Request body structure
 */
export interface ReturnRequest {
  user_id_string: string;
  item_sku: string;
}

/**
 * POST /api/returns
 * Response structure
 */
export interface ReturnResponse {
  status: string;
  message: string;
}

// Legacy types for UI compatibility
export interface Transaction {
  id: string;
  store: string;
  date: string;
  amount: number;
  bonuses: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  points: number;
  valid_from: string;
  valid_to: string;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to log requests
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Error:', error.message);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET /api/users/{user_id_string}/balance
   * Get user balance
   * Returns: { user_id_string: string, balance: number }
   */
  async getBalance(): Promise<Balance> {
    const userId = getUserId();
    const response = await this.client.get(`/api/users/${userId}/balance`);
    return response.data;
  }

  /**
   * GET /api/users/{user_id_string}/history
   * Get user transaction history
   * Returns: Array of { item_name, location_name, points_awarded, date }
   */
  async getHistory(): Promise<HistoryItem[]> {
    const userId = getUserId();
    const response = await this.client.get(`/api/users/${userId}/history`);
    return response.data;
  }

  /**
   * Legacy method for UI compatibility
   * Converts history items to transaction format
   */
  async getTransactions(): Promise<Transaction[]> {
    const history = await this.getHistory();
    
    // Convert history items to transaction format for UI
    return history.map((item, index) => ({
      id: `${index + 1}`,
      store: item.location_name,
      date: new Date(item.date).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      amount: 0, // Not provided by API
      bonuses: item.points_awarded,
    }));
  }

  /**
   * GET /api/catalog
   * Get catalog of recyclable items
   */
  async getCatalog(): Promise<CatalogItem[]> {
    const response = await this.client.get('/api/catalog');
    return response.data;
  }

  /**
   * GET /api/catalog (mapped to products)
   * Get products from catalog
   */
  async getProducts(): Promise<Product[]> {
    const catalogItems = await this.getCatalog();
    
    // Transform catalog items to products
    return catalogItems.map((item) => ({
      id: item.item_sku,
      name: item.name,
      image: this.generatePlaceholderImage(item.name),
      original_price: 100000,
      discounted_price: 80000,
      discount_percentage: 20,
      points: item.points_awarded,
      valid_from: '25.10.2025',
      valid_to: '12.11.2025',
    }));
  }

  /**
   * Generate a placeholder image using SVG data URL
   */
  private generatePlaceholderImage(text: string): string {
    const svg = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#f5f5f5"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle" dominant-baseline="middle">
          ${text.substring(0, 30)}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }

  /**
   * GET /api/locations
   * Get store locations
   * Returns: Array of { id, name, address, latitude, longitude }
   */
  async getLocations(): Promise<Location[]> {
    const response = await this.client.get('/api/locations');
    return response.data;
  }

  /**
   * POST /api/returns
   * Register a return/scan
   * Request body: { user_id_string: string, item_sku: string }
   * Response: { status: string, message: string }
   */
  async registerReturn(itemSku: string): Promise<ReturnResponse> {
    const userId = getUserId();
    const data: ReturnRequest = {
      user_id_string: userId,
      item_sku: itemSku,
    };
    const response = await this.client.post('/api/returns', data);
    return response.data;
  }

  /**
   * Scan barcode (wrapper for registerReturn)
   * Scans a barcode and registers the return
   */
  async scanBarcode(barcode: string): Promise<any> {
    try {
      const result = await this.registerReturn(barcode);
      
      return {
        success: result.status === 'success' || result.status === 'ok',
        barcode,
        status: result.status,
        message: result.message,
      };
    } catch (error: any) {
      const errorDetail = error.response?.data?.detail;
      const errorMessage = Array.isArray(errorDetail) 
        ? errorDetail.map((e: any) => e.msg).join(', ')
        : errorDetail || error.message || 'Failed to scan barcode';
      
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

