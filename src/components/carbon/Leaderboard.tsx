import React from 'react'
import { Trophy, Medal, Award, TrendingDown, Users, Target } from 'lucide-react'

const Leaderboard: React.FC = () => {
  // Mock leaderboard data - in a real app, this would come from the API
  const leaderboardData = [
    { id: 1, name: 'Priya Sharma', avatar: 'PS', emissions: 1.2, reduction: 35, rank: 1 },
    { id: 2, name: 'Arjun Patel', avatar: 'AP', emissions: 1.4, reduction: 28, rank: 2 },
    { id: 3, name: 'Sneha Kumar', avatar: 'SK', emissions: 1.6, reduction: 22, rank: 3 },
    { id: 4, name: 'Rohit Singh', avatar: 'RS', emissions: 1.8, reduction: 18, rank: 4 },
    { id: 5, name: 'You', avatar: 'YU', emissions: 2.1, reduction: 15, rank: 5 },
    { id: 6, name: 'Kavya Nair', avatar: 'KN', emissions: 2.3, reduction: 12, rank: 6 },
    { id: 7, name: 'Vikram Joshi', avatar: 'VJ', emissions: 2.5, reduction: 8, rank: 7 },
  ]

  const achievements = [
    { 
      id: 1, 
      title: 'Green Warrior', 
      description: '30 days below average emissions', 
      icon: Trophy, 
      color: 'yellow',
      earned: true 
    },
    { 
      id: 2, 
      title: 'Eco Champion', 
      description: '50 activities logged', 
      icon: Medal, 
      color: 'green',
      earned: true 
    },
    { 
      id: 3, 
      title: 'Carbon Crusher', 
      description: '20% emission reduction', 
      icon: Award, 
      color: 'blue',
      earned: false 
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold text-gray-600">
          {rank}
        </div>
    }
  }

  const getReductionColor = (reduction: number) => {
    if (reduction >= 30) return 'text-green-600 bg-green-50'
    if (reduction >= 20) return 'text-blue-600 bg-blue-50'
    if (reduction >= 10) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Leaderboard</h2>
          <p className="text-gray-600">
            See how you rank among other climate-conscious users this month
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-200 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-700">Your Rank</p>
                <p className="text-2xl font-bold text-yellow-900">#5</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-200 rounded-lg">
                <TrendingDown className="w-6 h-6 text-green-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Your Reduction</p>
                <p className="text-2xl font-bold text-green-900">15%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Active Users</p>
                <p className="text-2xl font-bold text-blue-900">1,247</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Rankings</h3>
                <p className="text-sm text-gray-500 mt-1">Based on daily average emissions</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {leaderboardData.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        user.name === 'You' 
                          ? 'bg-climate-green-50 border-climate-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          {getRankIcon(user.rank)}
                          <div className="w-10 h-10 bg-gradient-to-r from-climate-blue-400 to-climate-green-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {user.avatar}
                          </div>
                </div>
                <div>
                          <p className={`font-medium ${
                            user.name === 'You' ? 'text-climate-green-900' : 'text-gray-900'
                          }`}>
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.emissions.toFixed(1)} kg CO₂/day
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getReductionColor(user.reduction)
                        }`}>
                          -{user.reduction}%
                        </span>
                      </div>
                </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
          </div>
              <div className="p-6">
                <div className="space-y-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon
              return (
                <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border ${
                          achievement.earned 
                            ? `bg-${achievement.color}-50 border-${achievement.color}-200` 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-6 h-6 ${
                            achievement.earned 
                              ? `text-${achievement.color}-600` 
                              : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <p className={`font-medium ${
                              achievement.earned ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {achievement.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.earned && (
                            <div className="text-green-500">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                  </div>
                          )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
          </div>
          
            {/* Goals */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Goals</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Reduce by 20%
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">15% / 20%</span>
                    </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Log 30 activities
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">22 / 30</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Challenge */}
        <div className="mt-8 bg-gradient-to-r from-climate-blue-50 to-climate-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🌍 Community Challenge: Car-Free Week
              </h3>
              <p className="text-gray-600 mb-4">
                Join 500+ users in reducing transportation emissions this week!
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-500">Progress: 342/500 participants</span>
                <span className="text-green-600 font-medium">3 days left</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-climate-green-600 text-white rounded-lg hover:bg-climate-green-700 transition-colors">
              Join Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard