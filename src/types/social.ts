export interface SocialPost {
  id: string
  author_id: string
  caption?: string
  image_url?: string
  image_analysis?: any
  latitude?: number
  longitude?: number
  location_name?: string
  weather_data?: any
  air_quality_data?: any
  likes_count: number
  comments_count: number
  is_public: boolean
  created_at: string
  updated_at?: string
  author?: {
    id: string
    username: string
    full_name?: string
    avatar_url?: string
  }
}

export interface CreatePost {
  caption?: string
  image_url?: string
  latitude?: number
  longitude?: number
  location_name?: string
  weather_data?: any
  air_quality_data?: any
  is_public?: boolean
}

export interface PostComment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  author?: {
    id: string
    username: string
    full_name?: string
    avatar_url?: string
  }
}

export interface CreateComment {
  content: string
}

// Legacy types for backward compatibility
export interface Post extends SocialPost {}
export interface CreatePostRequest extends CreatePost {}
export interface Comment extends PostComment {}
export interface CreateCommentRequest extends CreateComment {}
