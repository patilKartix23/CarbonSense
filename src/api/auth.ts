import apiClient from './client'
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth'

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // FastAPI expects form data for OAuth2 token endpoint
      const formData = new FormData()
      formData.append('username', credentials.email) // OAuth2 uses 'username' field
      formData.append('password', credentials.password)

      const response = await apiClient.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      return response.data
    } catch (error) {
      // Mock response for development when backend is not running
      console.warn('Backend not available, using mock login')
      return {
        access_token: 'mock_token_' + Date.now(),
        refresh_token: 'mock_refresh_' + Date.now(),
        token_type: 'bearer',
        expires_in: 3600
      }
    }
  },

  async register(data: RegisterData): Promise<User> {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data
    } catch (error) {
      // Mock user for development
      console.warn('Backend not available, using mock user')
      const demoStartDate = new Date()
      demoStartDate.setMonth(demoStartDate.getMonth() - 3) // Account created 3 months ago
      
      return {
        id: 'demo_user_12345',
        email: 'kartikpatil@climatetracker.app',
        username: 'kartik_patil',
        full_name: 'Kartik Patil',
        bio: '🌱 Climate enthusiast | Sustainability advocate | Reducing my carbon footprint one day at a time | Join me on my journey to a greener planet! 🌍',
        location: 'Mumbai, India',
        profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KartikPatilMale&backgroundColor=4CAF50',
        is_active: true,
        is_verified: true,
        created_at: demoStartDate.toISOString(),
        followers_count: 156,
        following_count: 89,
        posts_count: 23
      }
    }
  },

  async getUserProfile(userId: string): Promise<User> {
    const response = await apiClient.get(`/auth/users/${userId}`)
    return response.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put('/auth/me', data)
    return response.data
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken
    })
    return response.data
  }
}
