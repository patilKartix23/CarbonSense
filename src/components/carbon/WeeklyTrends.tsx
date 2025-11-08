import React, { useState, useEffect } from 'react'
import { TrendingDown, TrendingUp, Calendar, Target, Activity } from 'lucide-react'
import { carbonAPI, CarbonActivity } from '../../api/carbon'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const WeeklyTrends: React.FC = () => {
  const [activities, setActivities] = useState<CarbonActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d')

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const data = await carbonAPI.getRecentActivities(timeRange === '7d' ? 50 : 100)
        setActivities(data)
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [timeRange])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Process data for charts
  const now = new Date()
  const daysToShow = timeRange === '7d' ? 7 : 30
  const dates = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (daysToShow - 1 - i))
    return date
  })

  // Group activities by date
  const dailyEmissions = dates.map(date => {
    const dateStr = date.toISOString().split('T')[0]
    const dayActivities = activities.filter(activity => 
      activity.date.startsWith(dateStr)
    )
    return {
      date: dateStr,
      emissions: dayActivities.reduce((sum, activity) => sum + activity.emissions_kg_co2, 0),
      activities: dayActivities.length
    }
  })

  // Group by category for weekly breakdown
  const categoryTotals = activities.reduce((acc, activity) => {
    const category = activity.category
    if (!acc[category]) {
      acc[category] = { emissions: 0, count: 0 }
    }
    acc[category].emissions += activity.emissions_kg_co2
    acc[category].count += 1
    return acc
  }, {} as Record<string, { emissions: number; count: number }>)

  // Chart data
  const trendData = {
    labels: dailyEmissions.map(day => {
      const date = new Date(day.date)
      return timeRange === '7d' 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [{
      label: 'Daily Emissions (kg CO₂)',
      data: dailyEmissions.map(day => day.emissions),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  const categoryData = {
    labels: Object.keys(categoryTotals).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [{
      label: 'Emissions by Category (kg CO₂)',
      data: Object.values(categoryTotals).map(cat => cat.emissions),
      backgroundColor: [
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // yellow
        '#8B5CF6', // purple
        '#6B7280'  // gray
      ]
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'kg CO₂'
        }
      }
    }
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'kg CO₂'
        }
      }
    }
  }

  // Calculate statistics
  const totalEmissions = dailyEmissions.reduce((sum, day) => sum + day.emissions, 0)
  const averageDaily = totalEmissions / daysToShow
  const totalActivities = activities.length
  
  // Find trend
  const firstHalf = dailyEmissions.slice(0, Math.floor(daysToShow / 2))
  const secondHalf = dailyEmissions.slice(Math.floor(daysToShow / 2))
  const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.emissions, 0) / firstHalf.length
  const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.emissions, 0) / secondHalf.length
  const trend = secondHalfAvg > firstHalfAvg ? 'up' : 'down'
  const trendPercent = Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carbon Trends</h2>
            <p className="text-gray-600">Track your emission patterns over time</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === '7d'
                  ? 'bg-climate-green-100 text-climate-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === '30d'
                  ? 'bg-climate-green-100 text-climate-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Emissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEmissions.toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Daily Average</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageDaily.toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activities Logged</p>
                <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                trend === 'down' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {trend === 'down' ? (
                  <TrendingDown className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trend</p>
                <p className={`text-2xl font-bold ${
                  trend === 'down' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trendPercent.toFixed(0)}% {trend === 'down' ? '↓' : '↑'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Trend */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Daily Emissions ({timeRange === '7d' ? '7 Days' : '30 Days'})
            </h3>
            <div className="h-64">
              <Line data={trendData} options={chartOptions} />
              </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Category Breakdown
            </h3>
            <div className="h-64">
              <Bar data={categoryData} options={barChartOptions} />
              </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No activities logged yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {activity.category === 'transportation' && '🚗'}
                      {activity.category === 'food' && '🍔'}
                      {activity.category === 'energy' && '⚡'}
                      {activity.category === 'shopping' && '🛍️'}
                      {activity.category === 'household' && '🏠'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.activity_type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.value} {activity.unit}
                        {activity.description && ` • ${activity.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {activity.emissions_kg_co2.toFixed(2)} kg CO₂
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeeklyTrends