export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  bio?: string
  location?: string
  profile_image_url?: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  followers_count?: number
  following_count?: number
  posts_count?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  full_name?: string
  bio?: string
  location?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}
