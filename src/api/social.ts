import apiClient from './client'
import { SocialPost, CreatePost, PostComment, CreateComment } from '../types/social'

export const socialAPI = {
  // Posts
  async getPosts(skip: number = 0, limit: number = 20): Promise<SocialPost[]> {
    try {
      const response = await apiClient.get('/social/posts', {
        params: { skip, limit }
      })
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock social posts')
      return this.getMockPosts()
    }
  },

  async createPost(postData: CreatePost): Promise<SocialPost> {
    try {
      const response = await apiClient.post('/social/posts', postData)
      return response.data
    } catch (error) {
      console.warn('Backend not available, returning mock post')
      return {
        id: Date.now().toString(),
        author_id: 'demo_user_12345',
        caption: postData.caption,
        image_url: postData.image_url,
        location_name: postData.location_name,
        latitude: postData.latitude,
        longitude: postData.longitude,
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        is_public: true,
        author: {
          id: 'demo_user_12345',
          username: 'demo_user',
          full_name: 'Alex Green',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo_user&backgroundColor=4CAF50'
        }
      }
    }
  },

  async likePost(postId: string): Promise<{ liked: boolean; likes_count: number }> {
    try {
      const response = await apiClient.post(`/social/posts/${postId}/like`)
      return response.data
    } catch (error) {
      console.warn('Backend not available')
      return { liked: true, likes_count: Math.floor(Math.random() * 50) + 1 }
    }
  },

  async unlikePost(postId: string): Promise<{ liked: boolean; likes_count: number }> {
    try {
      const response = await apiClient.delete(`/social/posts/${postId}/like`)
      return response.data
    } catch (error) {
      console.warn('Backend not available')
      return { liked: false, likes_count: Math.floor(Math.random() * 50) }
    }
  },

  // Comments
  async getComments(postId: string): Promise<PostComment[]> {
    try {
      const response = await apiClient.get(`/social/posts/${postId}/comments`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock comments')
      return this.getMockComments(postId)
    }
  },

  async createComment(postId: string, commentData: CreateComment): Promise<PostComment> {
    try {
      const response = await apiClient.post(`/social/posts/${postId}/comments`, commentData)
      return response.data
    } catch (error) {
      console.warn('Backend not available, returning mock comment')
      return {
        id: Date.now().toString(),
        post_id: postId,
        author_id: 'demo_user_12345',
        content: commentData.content,
        created_at: new Date().toISOString(),
        author: {
          id: 'demo_user_12345',
          username: 'demo_user',
          full_name: 'Alex Green',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo_user&backgroundColor=4CAF50'
        }
      }
    }
  },

  // Following
  async followUser(userId: string): Promise<{ following: boolean }> {
    try {
      const response = await apiClient.post(`/social/users/${userId}/follow`)
      return response.data
    } catch (error) {
      console.warn('Backend not available')
      return { following: true }
    }
  },

  async unfollowUser(userId: string): Promise<{ following: boolean }> {
    try {
      const response = await apiClient.delete(`/social/users/${userId}/follow`)
      return response.data
    } catch (error) {
      console.warn('Backend not available')
      return { following: false }
    }
  },

  // Mock data for development
  getMockPosts(): SocialPost[] {
    return [
      {
        id: 'post-1',
        author_id: 'user-kartiek',
        caption: 'Proud moment! 🌳 Our team successfully planted 50+ saplings today in Rajanukunte. Every tree we plant is a step towards cleaner air and a healthier planet. Together we\'re building a greener Karnataka! #TreePlantation #ClimateAction #RajanukunteGreen',
        image_url: '/images/team/tree-planting-team.jpg',
        location_name: 'Rajanukunte, Karnataka, India',
        latitude: 13.166015,
        longitude: 77.557363,
        likes_count: 247,
        comments_count: 34,
        created_at: new Date('2024-02-28T12:38:00Z').toISOString(),
        is_public: true,
        author: {
          id: 'user-kartiek',
          username: 'kartiekpatil',
          full_name: 'Kartiek Patil',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        }
      },
      {
        id: 'post-2',
        author_id: 'user-pavan',
        caption: 'Rainwater Harvesting Unit #4 installed and operational! 💧 This system can collect and store up to 10,000 liters during monsoon. Every drop saved is precious. Join the water conservation movement! #RainwaterHarvesting #WaterConservation #SustainableLiving',
        image_url: '/images/team/rainwater-harvesting-pavan.jpg',
        location_name: 'Rajanukunte, Karnataka, India',
        latitude: 13.169455,
        longitude: 77.55915,
        likes_count: 312,
        comments_count: 45,
        created_at: new Date('2024-02-28T11:19:00Z').toISOString(),
        is_public: true,
        author: {
          id: 'user-pavan',
          username: 'pavantej',
          full_name: 'Pavan Tej',
          avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
        }
      },
      {
        id: 'post-3',
        author_id: 'user-vikas',
        caption: 'Urban forest update 🌲 Our Miyawaki forest in Bangalore has grown to 15 feet in just 18 months! This dense native forest is now home to 30+ bird species and absorbs 50kg CO2 daily. Proof that nature bounces back when given a chance. #UrbanForest #Miyawaki #BangaloreGreen',
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        location_name: 'Bangalore, Karnataka, India',
        latitude: 12.9716,
        longitude: 77.5946,
        likes_count: 428,
        comments_count: 67,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        is_public: true,
        author: {
          id: 'user-vikas',
          username: 'vikashs',
          full_name: 'Vikas HS',
          avatar_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150'
        },
        weather_data: {
          temperature: 24,
          humidity: 68,
          description: 'partly cloudy'
        },
        air_quality_data: {
          aqi: 2,
          pm25: 15.2
        }
      },
      {
        id: 'post-4',
        author_id: 'user-harish',
        caption: 'Harvest season at our organic farm! 🌾 Zero pesticides, 100% natural. Our sustainable farming methods have increased soil carbon by 40% and water retention by 60%. Proud to grow food that heals both people and planet. #OrganicFarming #SustainableAgriculture #Mysuru',
        image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        location_name: 'Mysuru, Karnataka, India',
        latitude: 12.2958,
        longitude: 76.6394,
        likes_count: 356,
        comments_count: 52,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        is_public: true,
        author: {
          id: 'user-harish',
          username: 'harishbudial',
          full_name: 'Harish Budial',
          avatar_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150'
        }
      },
      {
        id: 'post-5',
        author_id: 'user-kartiek',
        caption: 'Solar panel installation complete at community center! ☀️ 10kW system will generate 15,000 units annually, saving ₹1.2L on electricity bills and offsetting 12 tons of CO2 every year. Clean energy is the future! #SolarPower #RenewableEnergy #CleanEnergy',
        image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
        location_name: 'Rajanukunte, Karnataka, India',
        latitude: 13.166015,
        longitude: 77.557363,
        likes_count: 289,
        comments_count: 41,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        is_public: true,
        author: {
          id: 'user-kartiek',
          username: 'kartiekpatil',
          full_name: 'Kartiek Patil',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        }
      },
      {
        id: 'post-6',
        author_id: 'user-pavan',
        caption: 'Lake cleanup drive success! 🌊 Removed 2 tons of plastic waste from our local lake today with 100+ volunteers. Clean water is everyone\'s right. Let\'s keep our water bodies plastic-free! #LakeCleanup #PlasticFree #WaterConservation #VolunteerWork',
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        location_name: 'Bangalore, Karnataka, India',
        latitude: 12.9716,
        longitude: 77.5946,
        likes_count: 523,
        comments_count: 89,
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        is_public: true,
        author: {
          id: 'user-pavan',
          username: 'pavantej',
          full_name: 'Pavan Tej',
          avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
        }
      },
      {
        id: 'post-9',
        author_id: 'user-harish',
        caption: 'Organic farming land preparation complete! 🌾 Our team at 5H84+VM8, Rajanukunte worked together to prepare 2 acres of land for organic vegetable farming. No chemical fertilizers, pure natural methods. Special thanks to our experienced farmer guide for teaching us traditional techniques. Building sustainable food systems one field at a time! 👨‍🌾💚 #OrganicFarming #SustainableAgriculture #TeamWork #FoodSecurity',
        image_url: '/images/team/organic-farming-team.jpg',
        location_name: '5H84+VM8, Rajanukunte, Karnataka 560064, India',
        latitude: 13.166188,
        longitude: 77.557667,
        likes_count: 398,
        comments_count: 51,
        created_at: new Date('2024-02-28T12:45:00Z').toISOString(),
        is_public: true,
        author: {
          id: 'user-harish',
          username: 'harishbudial',
          full_name: 'Harish Budial',
          avatar_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150'
        }
      }
    ]
  },

  getMockComments(postId: string): PostComment[] {
    const comments = [
      {
        id: 'comment-1',
        post_id: postId,
        author_id: 'user-pavan',
        content: 'Amazing work! Those trees will make such a difference. Count me in for the next plantation drive! 🌳',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: {
          id: 'user-pavan',
          username: 'pavantej',
          full_name: 'Pavan Tej',
          avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
        }
      },
      {
        id: 'comment-2',
        post_id: postId,
        author_id: 'user-vikas',
        content: 'Great initiative! Make sure to maintain them well for the first 2 years. That\'s crucial for survival rate.',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        author: {
          id: 'user-vikas',
          username: 'vikashs',
          full_name: 'Vikas HS',
          avatar_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150'
        }
      },
      {
        id: 'comment-3',
        post_id: postId,
        author_id: 'user-harish',
        content: 'This is brilliant! Can you share the design specs? We want to implement this in our village too.',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        author: {
          id: 'user-harish',
          username: 'harishbudial',
          full_name: 'Harish Budial',
          avatar_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150'
        }
      }
    ]
    return comments.slice(0, Math.floor(Math.random() * 3) + 1)
  }
}
