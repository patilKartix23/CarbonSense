import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingDown, TrendingUp, Target, Calendar, Zap } from 'lucide-react'
import { carbonAPI, CarbonDashboard } from '../../api/carbon'
import { Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
)

const DailySummary: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<CarbonDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const data = await carbonAPI.getCarbonDashboard()
        setDashboardData(data)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">Start logging activities to see your carbon footprint summary.</p>
        </div>
      </div>
    )
  }

  const { summary, category_breakdown, daily_emissions_7d } = dashboardData

  // Prepare chart data
  const categoryData = {
    labels: Object.keys(category_breakdown).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [{
      data: Object.values(category_breakdown).map(cat => cat.total_emissions_kg_co2),
      backgroundColor: [
        '#3B82F6', // blue - transportation
        '#10B981', // green - food
        '#F59E0B', // yellow - energy
        '#8B5CF6', // purple - shopping
        '#6B7280'  // gray - household
      ],
      borderWidth: 0
    }]
  }

  const trendData = {
    labels: daily_emissions_7d.map(day => {
      const date = new Date(day.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }).reverse(),
    datasets: [{
      label: 'Daily Emissions (kg CO₂)',
      data: daily_emissions_7d.map(day => day.emissions_kg_co2).reverse(),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  }

  const lineChartOptions = {
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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carbon Footprint Summary</h2>
          <p className="text-gray-600">Your environmental impact over the last 30 days</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">30-Day Total</p>
                <p className="text-2xl font-bold text-blue-900">
                  {summary.total_emissions_30d_kg_co2.toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-200 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Daily Average</p>
                <p className="text-2xl font-bold text-green-900">
                  {summary.daily_average_kg_co2.toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-200 rounded-lg">
                <Target className="w-6 h-6 text-yellow-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-700">Annual Estimate</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {summary.annual_estimate_tons_co2.toFixed(1)} tons
                </p>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-r rounded-lg p-6 ${
            summary.comparison_to_india_avg.status === 'below' 
              ? 'from-green-50 to-green-100' 
              : 'from-red-50 to-red-100'
          }`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                summary.comparison_to_india_avg.status === 'below' 
                  ? 'bg-green-200' 
                  : 'bg-red-200'
              }`}>
                {summary.comparison_to_india_avg.status === 'below' ? (
                  <TrendingDown className={`w-6 h-6 ${
                    summary.comparison_to_india_avg.status === 'below' 
                      ? 'text-green-700' 
                      : 'text-red-700'
                  }`} />
                ) : (
                  <TrendingUp className={`w-6 h-6 ${
                    summary.comparison_to_india_avg.status === 'below' 
                      ? 'text-green-700' 
                      : 'text-red-700'
                  }`} />
                )}
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${
                  summary.comparison_to_india_avg.status === 'below' 
                    ? 'text-green-700' 
                    : 'text-red-700'
                }`}>
                  vs India Avg
                </p>
                <p className={`text-2xl font-bold ${
                  summary.comparison_to_india_avg.status === 'below' 
                    ? 'text-green-900' 
                    : 'text-red-900'
                }`}>
                  {Math.abs(summary.comparison_to_india_avg.percentage_difference).toFixed(0)}%{' '}
                  {summary.comparison_to_india_avg.status === 'below' ? 'lower' : 'higher'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Category</h3>
            <div className="h-64">
              <Doughnut data={categoryData} options={chartOptions} />
            </div>
          </div>

          {/* 7-Day Trend */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Trend</h3>
            <div className="h-64">
              <Line data={trendData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Category Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(category_breakdown).map(([category, data]) => {
              const categoryNames = {
                transportation: '🚗 Transportation',
                food: '🍔 Food & Diet',
                energy: '⚡ Energy',
                shopping: '🛍️ Shopping',
                household: '🏠 Household'
              }
              
              return (
                <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">
                      {categoryNames[category as keyof typeof categoryNames] || category}
                    </div>
                    <div className="text-sm text-gray-500">
                      {data.activity_count} activities
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {data.total_emissions_kg_co2.toFixed(1)} kg CO₂
                    </div>
                    <div className="text-sm text-gray-500">
                      {data.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-gradient-to-r from-climate-blue-50 to-climate-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🎯 Daily Target</h4>
              <p className="text-sm text-gray-600">
                You're averaging {summary.daily_average_kg_co2.toFixed(1)} kg CO₂ per day. 
                The global target is around 2.3 kg per day by 2030.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📊 Progress</h4>
              <p className="text-sm text-gray-600">
                {summary.comparison_to_india_avg.status === 'below' 
                  ? "Great job! You're below the India average. Keep it up!"
                  : "Room for improvement. Small changes can make a big difference."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailySummary