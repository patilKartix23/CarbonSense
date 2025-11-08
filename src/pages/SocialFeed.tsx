import React, { useState, useEffect } from 'react'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MapPin, 
  Clock,
  Thermometer,
  Wind,
  Plus,
  Camera,
  X
} from 'lucide-react'
import { socialAPI } from '../api/social'
import { SocialPost, CreatePost, PostComment, CreateComment } from '../types/social'
import { useLocation } from '../contexts/LocationContext'
import { useAuth } from '../contexts/AuthContext'

const SocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState<CreatePost>({
    caption: '',
    is_public: true
  })
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [comments, setComments] = useState<Record<string, PostComment[]>>({})
  const [newComments, setNewComments] = useState<Record<string, string>>({})
  
  const { selectedCity } = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const postsData = await socialAPI.getPosts()
      setPosts(postsData)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.caption?.trim()) return

    try {
      const postData: CreatePost = {
        ...newPost,
        location_name: selectedCity.name,
        latitude: selectedCity.lat,
        longitude: selectedCity.lon
      }

      const createdPost = await socialAPI.createPost(postData)
      setPosts([createdPost, ...posts])
      setNewPost({ caption: '', is_public: true })
      setShowCreatePost(false)
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    try {
      const result = isLiked 
        ? await socialAPI.unlikePost(postId)
        : await socialAPI.likePost(postId)
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes_count: result.likes_count }
          : post
      ))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const toggleComments = async (postId: string) => {
    const newExpanded = new Set(expandedComments)
    
    if (expandedComments.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
      // Load comments if not already loaded
      if (!comments[postId]) {
        try {
          const postComments = await socialAPI.getComments(postId)
          setComments(prev => ({ ...prev, [postId]: postComments }))
        } catch (error) {
          console.error('Error loading comments:', error)
        }
      }
    }
    
    setExpandedComments(newExpanded)
  }

  const handleAddComment = async (postId: string) => {
    const commentText = newComments[postId]?.trim()
    if (!commentText) return

    try {
      const comment = await socialAPI.createComment(postId, { content: commentText })
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }))
      setNewComments(prev => ({ ...prev, [postId]: '' }))
      
      // Update comments count
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      ))
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6 mt-1"></div>
                  </div>
                </div>
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Climate Social</h1>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-climate-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-climate-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Share Climate Update</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedCity.name}, {selectedCity.state}</span>
                </div>
                
                <textarea
                  value={newPost.caption}
                  onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                  placeholder="Share your climate observations, weather updates, or environmental insights..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-climate-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newPost.is_public}
                    onChange={(e) => setNewPost({ ...newPost, is_public: e.target.checked })}
                    className="rounded text-climate-blue-600"
                  />
                  <span className="text-sm text-gray-600">Make public</span>
                </label>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.caption?.trim()}
                    className="bg-climate-blue-600 text-white px-6 py-2 rounded-lg hover:bg-climate-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-climate-blue-500 to-climate-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author?.full_name?.charAt(0) || post.author?.username?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {post.author?.full_name || post.author?.username || 'Anonymous'}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(post.created_at)}</span>
                      {post.location_name && (
                        <>
                          <span>•</span>
                          <MapPin className="w-3 h-3" />
                          <span>{post.location_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Image */}
              {post.image_url && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.image_url}
                    alt="Post content"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="p-4">
                {post.caption && (
                  <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.caption}</p>
                )}

                {/* Weather/Air Quality Data */}
                {(post.weather_data || post.air_quality_data) && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-4 text-sm">
                      {post.weather_data && (
                        <div className="flex items-center space-x-1">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <span>{post.weather_data.temperature}°C</span>
                        </div>
                      )}
                      {post.weather_data?.humidity && (
                        <div className="flex items-center space-x-1">
                          <Wind className="w-4 h-4 text-blue-500" />
                          <span>{post.weather_data.humidity}% humidity</span>
                        </div>
                      )}
                      {post.air_quality_data && (
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            post.air_quality_data.aqi <= 2 ? 'bg-green-500' : 
                            post.air_quality_data.aqi <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span>AQI {post.air_quality_data.aqi}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLikePost(post.id, false)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes_count}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments_count}</span>
                  </button>

                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                    <Share className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Comments List */}
                    <div className="space-y-3 mb-4">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-climate-blue-400 to-climate-green-400 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {comment.author?.full_name?.charAt(0) || comment.author?.username?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm font-medium text-gray-900">
                                {comment.author?.full_name || comment.author?.username || 'Anonymous'}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTimeAgo(comment.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-climate-blue-500 to-climate-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'Y'}
                      </div>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={newComments[post.id] || ''}
                          onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write a comment..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-climate-blue-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(post.id)
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newComments[post.id]?.trim()}
                          className="px-4 py-2 bg-climate-blue-600 text-white rounded-lg text-sm hover:bg-climate-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-climate-blue-500 to-climate-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share climate updates from your area!</p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-climate-blue-600 text-white px-6 py-2 rounded-lg hover:bg-climate-blue-700 transition-colors"
            >
              Create First Post
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialFeed