import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Thermometer,
  Droplets,
  Cloud
} from 'lucide-react'
import { indianClimateAPI, MonthlyTrends } from '../../api/indian-climate'

interface ChartType {
  type: 'temperature' | 'humidity' | 'rainfall';
  label: string;
  icon: React.ReactNode;
  color: string;
  unit: string;
}

const ClimateTrendsChart: React.FC = () => {
  const [trendsData, setTrendsData] = useState<MonthlyTrends | null>(null)
  const [selectedChart, setSelectedChart] = useState<ChartType['type']>('temperature')
  const [loading, setLoading] = useState(true)

  const chartTypes: ChartType[] = [
    { 
      type: 'temperature', 
      label: 'Temperature', 
      icon: <Thermometer className="w-4 h-4" />, 
      color: 'red',
      unit: '°C'
    },
    { 
      type: 'humidity', 
      label: 'Humidity', 
      icon: <Droplets className="w-4 h-4" />, 
      color: 'blue',
      unit: '%'
    },
    { 
      type: 'rainfall', 
      label: 'Rainfall', 
      icon: <Cloud className="w-4 h-4" />, 
      color: 'indigo',
      unit: 'mm'
    }
  ]

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  useEffect(() => {
    loadTrendsData()
  }, [])

  const loadTrendsData = async () => {
    setLoading(true)
    try {
      const data = await indianClimateAPI.getMonthlyTrends()
      setTrendsData(data)
    } catch (error) {
      console.error('Failed to load trends data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentChartData = () => {
    if (!trendsData) return []
    
    const data = trendsData[selectedChart]
    return Object.entries(data).map(([month, value]) => ({
      month: parseInt(month),
      monthName: monthNames[parseInt(month) - 1],
      value: Number(value)
    }))
  }

  const getBarColor = (type: ChartType['type']) => {
    switch (type) {
      case 'temperature': return 'bg-red-500'
      case 'humidity': return 'bg-blue-500'
      case 'rainfall': return 'bg-indigo-500'
      default: return 'bg-gray-500'
    }
  }

  const getMaxValue = () => {
    const data = getCurrentChartData()
    return Math.max(...data.map(d => d.value))
  }

  const getMinValue = () => {
    const data = getCurrentChartData()
    return Math.min(...data.map(d => d.value))
  }

  const getSeasonHighlight = (month: number) => {
    // Indian seasons
    if ([12, 1, 2].includes(month)) return 'Winter' // Dec, Jan, Feb
    if ([3, 4, 5].includes(month)) return 'Summer' // Mar, Apr, May
    if ([6, 7, 8, 9].includes(month)) return 'Monsoon' // Jun, Jul, Aug, Sep
    return 'Post-Monsoon' // Oct, Nov
  }

  const chartData = getCurrentChartData()
  const maxValue = getMaxValue()
  const currentChart = chartTypes.find(c => c.type === selectedChart)!

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-climate-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Monthly Climate Trends</h3>
        </div>
        
        {/* Chart Type Selector */}
        <div className="flex space-x-2">
          {chartTypes.map((chart) => (
            <button
              key={chart.type}
              onClick={() => setSelectedChart(chart.type)}
              className={`btn flex items-center space-x-2 ${
                selectedChart === chart.type
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {chart.icon}
              <span>{chart.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Highest</p>
          <p className="font-bold text-gray-900">{maxValue.toFixed(1)} {currentChart.unit}</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Average</p>
          <p className="font-bold text-gray-900">
            {(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(1)} {currentChart.unit}
          </p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-red-500 mx-auto mb-1 rotate-180" />
          <p className="text-sm text-gray-600">Lowest</p>
          <p className="font-bold text-gray-900">{getMinValue().toFixed(1)} {currentChart.unit}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="flex items-end justify-between h-64 border-b border-gray-200">
          {chartData.map((data) => {
            const height = (data.value / maxValue) * 100
            const season = getSeasonHighlight(data.month)
            
            return (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div className="relative group">
                  {/* Tooltip */}
                  <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                    <div className="text-center">
                      <div className="font-semibold">{data.monthName}</div>
                      <div>{data.value.toFixed(1)} {currentChart.unit}</div>
                      <div className="text-gray-300">{season}</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                  
                  {/* Bar */}
                  <div
                    className={`${getBarColor(selectedChart)} rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer`}
                    style={{ 
                      height: `${Math.max(height, 2)}%`,
                      width: '80%',
                      minHeight: '8px'
                    }}
                  ></div>
                </div>
                
                {/* Month Label */}
                <div className="mt-2 text-xs text-gray-600 font-medium">
                  {data.monthName}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 -ml-12">
          <span>{maxValue.toFixed(0)}</span>
          <span>{(maxValue * 0.75).toFixed(0)}</span>
          <span>{(maxValue * 0.5).toFixed(0)}</span>
          <span>{(maxValue * 0.25).toFixed(0)}</span>
          <span>0</span>
        </div>
      </div>

      {/* Season Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
          <span className="text-sm text-gray-600">Winter (Dec-Feb)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-100 rounded-full"></div>
          <span className="text-sm text-gray-600">Summer (Mar-May)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 rounded-full"></div>
          <span className="text-sm text-gray-600">Monsoon (Jun-Sep)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
          <span className="text-sm text-gray-600">Post-Monsoon (Oct-Nov)</span>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Climate Insights</h4>
        <div className="text-sm text-blue-800 space-y-1">
          {selectedChart === 'temperature' && (
            <>
              <p>• Hottest months: April-May (Pre-monsoon summer)</p>
              <p>• Coolest months: December-January (Winter)</p>
              <p>• Temperature drops during monsoon season (June-September)</p>
            </>
          )}
          {selectedChart === 'humidity' && (
            <>
              <p>• Highest humidity during monsoon season (June-September)</p>
              <p>• Lowest humidity in winter and summer months</p>
              <p>• Coastal regions show consistently higher humidity levels</p>
            </>
          )}
          {selectedChart === 'rainfall' && (
            <>
              <p>• Southwest monsoon brings 70-80% of annual rainfall</p>
              <p>• Peak rainfall: July-August across most regions</p>
              <p>• Winter months (Dec-Feb) receive minimal rainfall</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClimateTrendsChart