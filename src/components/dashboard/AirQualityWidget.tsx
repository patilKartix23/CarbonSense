import React from 'react'
import { Wind, AlertCircle, CheckCircle } from 'lucide-react'
import { useWeather } from '../../hooks/useWeather'

interface AirQualityWidgetProps {
  location: { lat: number; lon: number } | null
}

const AirQualityWidget: React.FC<AirQualityWidgetProps> = ({ location }) => {
  const { airQuality, loading, error } = useWeather(location?.lat, location?.lon)

  const getStatusIcon = (category: string) => {
    if (category === 'Good' || category === 'Fair') {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    return <AlertCircle className="w-5 h-5 text-yellow-500" />
  }

  const getRecommendation = (category: string) => {
    switch (category) {
      case 'Good':
        return 'Air quality is excellent. Perfect for outdoor activities!'
      case 'Fair':
        return 'Air quality is acceptable for most people.'
      case 'Moderate':
        return 'Air quality is acceptable for most people. Sensitive individuals may experience minor issues.'
      case 'Poor':
        return 'Air quality is poor. Consider limiting outdoor activities.'
      case 'Very Poor':
        return 'Air quality is very poor. Avoid outdoor activities.'
      default:
        return 'Air quality data is being updated.'
    }
  }

  if (!location || loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error || !airQuality) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Air Quality</h3>
          <Wind className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-red-500 text-sm">Unable to load air quality data</p>
      </div>
    )
  }

  const { aqi, category, color } = airQuality

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Air Quality</h3>
        <Wind className="w-6 h-6 text-gray-400" />
      </div>

      {/* AQI Score */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                {aqi}
              </span>
              <span className="text-lg text-gray-500 ml-1">AQI</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(category)}
              <p className={`text-sm font-medium ${
                color === 'green' ? 'text-green-600' :
                color === 'yellow' ? 'text-yellow-600' :
                color === 'orange' ? 'text-orange-600' :
                color === 'red' ? 'text-red-600' :
                'text-purple-600'
              }`}>
                {category}
              </p>
            </div>
          </div>
          
          {/* AQI Circle */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${(aqi / 5) * 175.92} 175.92`}
                className={`${
                  color === 'green' ? 'text-green-500' :
                  color === 'yellow' ? 'text-yellow-500' :
                  color === 'orange' ? 'text-orange-500' :
                  color === 'red' ? 'text-red-500' :
                  'text-purple-500'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold ${
                color === 'green' ? 'text-green-600' :
                color === 'yellow' ? 'text-yellow-600' :
                color === 'orange' ? 'text-orange-600' :
                color === 'red' ? 'text-red-600' :
                'text-purple-600'
              }`}>
                {Math.round((aqi / 5) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pollutant Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">PM2.5</span>
          <span className="font-medium">{airQuality.pm25.toFixed(1)} μg/m³</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">PM10</span>
          <span className="font-medium">{airQuality.pm10.toFixed(1)} μg/m³</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">NO₂</span>
          <span className="font-medium">{airQuality.no2.toFixed(1)} μg/m³</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">O₃</span>
          <span className="font-medium">{airQuality.o3.toFixed(1)} μg/m³</span>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`p-3 rounded-lg ${
        color === 'green' ? 'bg-green-50' :
        color === 'yellow' ? 'bg-yellow-50' :
        color === 'orange' ? 'bg-orange-50' :
        color === 'red' ? 'bg-red-50' :
        'bg-purple-50'
      }`}>
        <p className={`text-xs ${
          color === 'green' ? 'text-green-800' :
          color === 'yellow' ? 'text-yellow-800' :
          color === 'orange' ? 'text-orange-800' :
          color === 'red' ? 'text-red-800' :
          'text-purple-800'
        }`}>
          {getRecommendation(category)}
        </p>
      </div>

      {/* Real-time indicator */}
      <div className="border-t pt-3 mt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Live data from OpenWeatherMap</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AirQualityWidget
