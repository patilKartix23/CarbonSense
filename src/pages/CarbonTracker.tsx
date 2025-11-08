import React, { useState, useEffect } from 'react'
import { Calculator, TrendingDown, Leaf, BarChart3, Plus, Target, Award, Users } from 'lucide-react'
import ActivityLogger from '../components/carbon/ActivityLogger'
import DailySummary from '../components/carbon/DailySummary'
import WeeklyTrends from '../components/carbon/WeeklyTrends'
import Leaderboard from '../components/carbon/Leaderboard'
import Suggestions from '../components/carbon/Suggestions'

const CarbonTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('logger')
  const [dailyTotal, setDailyTotal] = useState(0)
  const [activitiesLogged, setActivitiesLogged] = useState(0)

  const tabs = [
    { id: 'logger', name: 'Log Activity', icon: Plus },
    { id: 'summary', name: 'Today', icon: BarChart3 },
    { id: 'trends', name: 'Trends', icon: TrendingDown },
    { id: 'leaderboard', name: 'Leaderboard', icon: Users },
    { id: 'tips', name: 'Tips', icon: Target }
  ]

  const handleActivityLogged = (emissions: number) => {
    setDailyTotal(prev => prev + emissions)
    setActivitiesLogged(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-green-50">
              <Calculator className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Carbon Footprint Tracker
              </h1>
              <p className="text-gray-600 mt-1">
                Track your daily emissions and reduce your carbon footprint
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Footprint</p>
                <p className="text-2xl font-bold text-gray-900">{dailyTotal.toFixed(1)} kg CO₂</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activities Logged</p>
                <p className="text-2xl font-bold text-gray-900">{activitiesLogged}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Weekly Rank</p>
                <p className="text-2xl font-bold text-gray-900">#5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'logger' && (
            <ActivityLogger onActivityLogged={handleActivityLogged} />
          )}
          {activeTab === 'summary' && <DailySummary />}
          {activeTab === 'trends' && <WeeklyTrends />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'tips' && <Suggestions />}
        </div>
      </div>
    </div>
  )
}

export default CarbonTracker
