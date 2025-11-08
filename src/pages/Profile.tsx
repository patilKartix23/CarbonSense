import React, { useState, useEffect } from 'react'
import { 
  BarChart3, Camera, Edit2, Mail, MapPin, 
  Calendar, Award, TrendingDown, Leaf, Save, X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { authAPI } from '../api/auth'

interface ProfileStats {
  totalCO2Saved: number
  activitiesLogged: number
  daysActive: number
  rank: string
}

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    location: user?.location || ''
  })

  const [stats] = useState<ProfileStats>({
    totalCO2Saved: 145.7,
    activitiesLogged: 42,
    daysActive: 28,
    rank: 'Climate Champion'
  })

  useEffect(() => {
    if (user) {
      setEditedProfile({
        full_name: user.full_name || '',
        bio: user.bio || '',
        location: user.location || ''
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await authAPI.updateProfile(editedProfile)
      await refreshUser()
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile({
      full_name: user?.full_name || '',
      bio: user?.bio || '',
      location: user?.location || ''
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-climate-blue-500 to-climate-green-500 rounded-t-lg"></div>
            
            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
                {/* Profile Picture */}
                <div className="relative -mt-16 mb-4 md:mb-0">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                    {user.profile_image_url ? (
                      <img 
                        src={user.profile_image_url} 
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-climate-blue-400 to-climate-green-400 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  {!isEditing ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">
                            {user.full_name || user.username}
                          </h1>
                          <p className="text-gray-600">@{user.username}</p>
                        </div>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-climate-blue-600 text-white rounded-lg hover:bg-climate-blue-700 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        {user.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{user.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>

                      {user.bio && (
                        <p className="text-gray-700 mb-4">{user.bio}</p>
                      )}

                      <div className="flex space-x-6 text-sm">
                        <div>
                          <span className="font-semibold text-gray-900">{user.followers_count || 0}</span>
                          <span className="text-gray-600 ml-1">Followers</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{user.following_count || 0}</span>
                          <span className="text-gray-600 ml-1">Following</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{user.posts_count || 0}</span>
                          <span className="text-gray-600 ml-1">Posts</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editedProfile.full_name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-climate-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          value={editedProfile.bio}
                          onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-climate-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself and your climate journey..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editedProfile.location}
                          onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-climate-blue-500 focus:border-transparent"
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-climate-blue-600 text-white rounded-lg hover:bg-climate-blue-700 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">CO₂ Reduced</p>
                <p className="text-2xl font-bold text-climate-green-600">
                  {stats.totalCO2Saved} kg
                </p>
              </div>
              <div className="p-3 bg-climate-green-50 rounded-lg">
                <TrendingDown className="w-8 h-8 text-climate-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Activities Logged</p>
                <p className="text-2xl font-bold text-climate-blue-600">
                  {stats.activitiesLogged}
                </p>
              </div>
              <div className="p-3 bg-climate-blue-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-climate-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Days Active</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.daysActive}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rank</p>
                <p className="text-xl font-bold text-orange-600">
                  {stats.rank}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">First Step</p>
                  <p className="text-sm text-gray-600">Logged your first carbon activity</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Eco Warrior</p>
                  <p className="text-sm text-gray-600">Reduced 100kg of CO₂ emissions</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Consistency King</p>
                  <p className="text-sm text-gray-600">Logged activities for 7 days straight</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-climate-blue-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Public Transport</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
                <span className="text-sm font-semibold text-green-600">-2.5 kg CO₂</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Plant-based Meal</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
                <span className="text-sm font-semibold text-green-600">-1.8 kg CO₂</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Recycling</p>
                  <p className="text-sm text-gray-600">2 days ago</p>
                </div>
                <span className="text-sm font-semibold text-green-600">-0.5 kg CO₂</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
