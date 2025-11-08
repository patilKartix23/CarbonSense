import { 
  Product, 
  ProductSearchResponse, 
  Cart, 
  EducationalContentResponse,
  EcoFact,
  EcoTip,
  EcoChallenge
} from '../types/eco-shopping';

const API_BASE_URL = 'http://localhost:8000/api/eco-shopping';

class EcoShoppingAPI {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': 'user-123', // TODO: Get from auth context
          ...options.headers,
        },
        ...options,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Product APIs
  async searchProducts(filters: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    ecoFeatures?: string[];
    minRating?: number;
    inStock?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ProductSearchResponse | null> {
    const params = new URLSearchParams();
    
    if (filters.query) params.append('q', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.ecoFeatures) params.append('ecoFeatures', filters.ecoFeatures.join(','));
    if (filters.minRating !== undefined) params.append('minRating', filters.minRating.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.limit !== undefined) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    const result = await this.request<ProductSearchResponse>(endpoint);
    return result.success ? result.data || null : null;
  }

  async getProduct(productId: string): Promise<Product | null> {
    const result = await this.request<Product>(`/products/${productId}`);
    return result.success ? result.data || null : null;
  }

  async getCategories(): Promise<Array<{ name: string; count: number; subcategories: string[] }> | null> {
    const result = await this.request<Array<{ name: string; count: number; subcategories: string[] }>>('/categories');
    return result.success ? result.data || null : null;
  }

  async getRecommendations(type: 'eco-friendly' | 'popular' | 'new' = 'eco-friendly', limit: number = 6): Promise<Product[] | null> {
    const params = new URLSearchParams();
    params.append('type', type);
    params.append('limit', limit.toString());

    const result = await this.request<Product[]>(`/recommendations?${params.toString()}`);
    return result.success ? result.data || null : null;
  }

  // Cart APIs
  async getCart(): Promise<Cart | null> {
    const result = await this.request<Cart>('/cart');
    return result.success ? result.data || null : null;
  }

  async addToCart(productId: string, quantity: number = 1): Promise<Cart | null> {
    const result = await this.request<Cart>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
    return result.success ? result.data || null : null;
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart | null> {
    const result = await this.request<Cart>('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ itemId, quantity })
    });
    return result.success ? result.data || null : null;
  }

  async removeFromCart(itemId: string): Promise<Cart | null> {
    const result = await this.request<Cart>('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ itemId })
    });
    return result.success ? result.data || null : null;
  }

  async clearCart(): Promise<boolean> {
    const result = await this.request('/cart/clear', { method: 'DELETE' });
    return result.success;
  }

  // Educational Content APIs
  async getEcoFacts(category?: string, limit: number = 10): Promise<{ facts: EcoFact[]; dailyFact: EcoFact; totalCount: number } | null> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/educational/facts?${queryString}` : '/educational/facts';
    
    const result = await this.request<{ facts: EcoFact[]; dailyFact: EcoFact; totalCount: number }>(endpoint);
    return result.success ? result.data || null : null;
  }

  async getEcoTips(category?: string, difficulty?: string, limit: number = 10): Promise<{ tips: EcoTip[]; totalCount: number } | null> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/educational/tips?${queryString}` : '/educational/tips';
    
    const result = await this.request<{ tips: EcoTip[]; totalCount: number }>(endpoint);
    return result.success ? result.data || null : null;
  }

  async getEcoChallenges(type?: string, activeOnly: boolean = true): Promise<{ challenges: EcoChallenge[]; totalCount: number } | null> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('active', activeOnly.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/educational/challenges?${queryString}` : '/educational/challenges';
    
    const result = await this.request<{ challenges: EcoChallenge[]; totalCount: number }>(endpoint);
    return result.success ? result.data || null : null;
  }

  async getEducationalContent(): Promise<EducationalContentResponse | null> {
    const result = await this.request<EducationalContentResponse>('/educational/content');
    return result.success ? result.data || null : null;
  }

  // Wishlist APIs (for future implementation)
  async addToWishlist(productId: string): Promise<boolean> {
    const result = await this.request('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
    return result.success;
  }

  async removeFromWishlist(productId: string): Promise<boolean> {
    const result = await this.request('/wishlist/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId })
    });
    return result.success;
  }

  async getWishlist(): Promise<Product[] | null> {
    const result = await this.request<Product[]>('/wishlist');
    return result.success ? result.data || null : null;
  }

  // Order APIs (for future implementation)
  async createOrder(orderData: any): Promise<any> {
    const result = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    return result.success ? result.data : null;
  }

  async getOrders(): Promise<any[] | null> {
    const result = await this.request<any[]>('/orders');
    return result.success ? result.data || null : null;
  }

  async getOrder(orderId: string): Promise<any | null> {
    const result = await this.request<any>(`/orders/${orderId}`);
    return result.success ? result.data || null : null;
  }

  // User Progress APIs (for future implementation)
  async getUserProgress(): Promise<any | null> {
    const result = await this.request<any>('/user/progress');
    return result.success ? result.data || null : null;
  }

  async updateChallengeProgress(challengeId: string, taskId: string): Promise<boolean> {
    const result = await this.request('/user/challenge-progress', {
      method: 'POST',
      body: JSON.stringify({ challengeId, taskId })
    });
    return result.success;
  }

  async implementTip(tipId: string): Promise<boolean> {
    const result = await this.request('/user/implement-tip', {
      method: 'POST',
      body: JSON.stringify({ tipId })
    });
    return result.success;
  }
}

export const ecoShoppingAPI = new EcoShoppingAPI();
export default ecoShoppingAPI;
